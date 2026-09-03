import { auth } from "../../../auth";
import { connectToDB } from "../../../lib/db";
import User from "../../../models/User";
import { PLANS } from "../../lib/plans";
import { getPlanCatalogForUser } from "../../../lib/customPlansData";
import sendEmail from "../../../lib/sendEmail";
import sendPush from "../../../lib/sendPush";
import { renderNotificationEmail } from "../../../lib/emailTemplates";

const fmt = (n) => `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export async function POST(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
  }

  try {
    const { amount, plan, source } = await req.json();
    const numericAmount = Number(amount);
    const isPromo = source === "promo";

    if (!numericAmount || numericAmount <= 0) {
      return Response.json({ error: "Please enter a valid amount." }, { status: 400 });
    }

    const catalog = await getPlanCatalogForUser(session.user.id, PLANS);
    const planInfo = catalog[plan];
    if (!planInfo) {
      return Response.json({ error: "That plan isn't available to you." }, { status: 400 });
    }
    if (numericAmount < planInfo.min) {
      return Response.json({ error: `Minimum for ${plan} is $${planInfo.min.toLocaleString()}.` }, { status: 400 });
    }

    await connectToDB();
    const user = await User.findById(session.user.id);
    if (!user) return Response.json({ error: "User not found." }, { status: 404 });

    if (isPromo) {
      if (!user.promoBonus || user.promoBonus < numericAmount) {
        return Response.json({ error: `Insufficient promo balance. Available: ${fmt(user.promoBonus || 0)}` }, { status: 400 });
      }
    } else {
      // Referral bonus is excluded on purpose — withdraw-only, never
      // reinvestable. Principal still locked inside an active (unmatured)
      // deposit is excluded too — without this, that principal was both
      // still earning inside its own plan AND spendable via balance,
      // letting a single deposit fund two simultaneous investments.
      const lockedInActiveDeposits = user.activeDeposit.filter((d) => !d.stopped).reduce((sum, d) => sum + (d.amount || 0), 0);
      const reinvestable = Math.max(0, (user.balance || 0) - (user.referralBonus || 0) - lockedInActiveDeposits);
      if (reinvestable < numericAmount) {
        return Response.json({ error: `Insufficient balance. Available: ${fmt(reinvestable)}` }, { status: 400 });
      }
    }

    // Only merge into an existing plan of the same name if it hasn't matured
    // yet. An already-matured plan is left untouched and withdrawable —
    // reinvesting under that plan name starts a fresh, separate entry
    // instead of relocking money that was already earned.
    const existingActive = user.activeDeposit.find((d) => d.plan === plan && !d.stopped);

    const depositEntry = {
      amount: numericAmount,
      plan,
      method: isPromo ? "promo reinvestment" : "reinvestment",
      // depositSchema requires walletAddress for real crypto deposits (so
      // admins can cross-check a receipt against a real destination) — a
      // reinvestment is an internal transfer with no wallet involved at all,
      // so this is a fixed placeholder, not a real address.
      walletAddress: "internal-reinvestment",
      status: "approved",
    };

    let updated;
    if (existingActive) {
      const incOps = { "activeDeposit.$.amount": numericAmount };
      const setOps = { "activeDeposit.$.date": new Date() };

      if (isPromo) {
        incOps.promoBonus = -numericAmount;
      } else {
        const profitDeduct = Math.min(user.profit || 0, numericAmount);
        setOps.profit = (user.profit || 0) - profitDeduct;
        incOps.balance = -numericAmount;
        incOps["activeDeposit.$.balanceDeductedAmount"] = numericAmount;
      }

      updated = await User.findOneAndUpdate(
        { _id: session.user.id, "activeDeposit._id": existingActive._id },
        { $set: setOps, $inc: incOps, $push: { deposit: depositEntry } },
        { new: true, runValidators: true },
      );
    } else {
      const topLevel = isPromo
        ? { $inc: { promoBonus: -numericAmount } }
        : { $set: { profit: (user.profit || 0) - Math.min(user.profit || 0, numericAmount) }, $inc: { balance: -numericAmount } };

      updated = await User.findByIdAndUpdate(
        session.user.id,
        {
          ...topLevel,
          $push: {
            deposit: depositEntry,
            activeDeposit: {
              amount: numericAmount,
              plan,
              method: isPromo ? "promo" : "reinvestment",
              date: new Date(),
              stopped: false,
              withdrawn: false,
              balanceDeductedAmount: isPromo ? 0 : numericAmount,
              lastAccruedAt: new Date(),
            },
          },
        },
        { new: true, runValidators: true },
      );
    }

    if (!updated) {
      return Response.json({ error: "User not found." }, { status: 404 });
    }

    sendEmail(
      updated.email,
      isPromo ? "Promo Reinvestment Successful" : "Reinvestment Successful",
      `Hello ${updated.username}, your ${isPromo ? "promo " : ""}reinvestment of ${fmt(numericAmount)} into ${plan} was successful.`,
      renderNotificationEmail({
        heading: isPromo ? "Promo Reinvestment Successful" : "Reinvestment Successful",
        greeting: updated.username,
        message: isPromo
          ? "Your promo bonus has been successfully reinvested. Your investment is now active and earning returns."
          : "Your profit has been reinvested and your plan is now active.",
        badgeText: "Active",
        rows: [
          ["Amount", fmt(numericAmount), true],
          ["Plan", plan],
          ["Source", isPromo ? "Promo bonus" : "Account balance"],
          ["Status", "Active"],
        ],
      }),
    ).catch((err) => console.error("Reinvestment email failed:", err.message));

    sendPush(session.user.id, {
      title: isPromo ? "Promo reinvestment successful" : "Reinvestment successful",
      body: `${fmt(numericAmount)} is now active in ${plan}.`,
      url: "/dashboard",
    }).catch((err) => console.error("Reinvestment push failed:", err.message));

    // Referral bonus on reinvestment — standard source only, uncapped, paid
    // every time. Confirmed intentional, not a bug (see feedback memory).
    if (!isPromo && user.referredby) {
      const referringUser = await User.findOne({ username: user.referredby });
      if (referringUser) {
        const referralBonus = numericAmount * 0.1;
        await User.findByIdAndUpdate(referringUser._id, { $inc: { referralBonus, balance: referralBonus } });
        sendEmail(
          referringUser.email,
          "Referral Bonus Received",
          `You've earned a ${fmt(referralBonus)} referral bonus from ${user.username}'s reinvestment.`,
          renderNotificationEmail({
            heading: "Referral Bonus Received",
            greeting: referringUser.username,
            message: `You've earned a referral bonus from ${user.username}'s reinvestment.`,
            badgeText: "Bonus Earned",
            rows: [
              ["Bonus amount", fmt(referralBonus), true],
              ["From", user.username],
            ],
          }),
        ).catch((err) => console.error("Referral bonus email failed:", err.message));

        sendPush(referringUser._id, {
          title: "Referral bonus earned",
          body: `You earned ${fmt(referralBonus)} from ${user.username}'s reinvestment.`,
          url: "/dashboard/referrals",
        }).catch((err) => console.error("Referral bonus push failed:", err.message));
      }
    }

    return Response.json(
      { ok: true, reinvest: { amount: numericAmount, plan, source: isPromo ? "promo" : "profit" } },
      { status: 201 },
    );
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
