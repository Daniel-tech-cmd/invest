import mongoose from "mongoose";
import { auth } from "../../../auth";
import { connectToDB } from "../../../lib/db";
import User from "../../../models/User";
import sendEmail from "../../../lib/sendEmail";
import sendPush from "../../../lib/sendPush";
import { renderNotificationEmail } from "../../../lib/emailTemplates";

const fmt = (n) => `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const COIN_WALLET_FIELDS = {
  BTC: "bitcoinAccountId",
  ETH: "ethereumAccountId",
  LTC: "litecoinAccountId",
  USDT: "usdtAccountId",
  DOGE: "dogeAccountId",
};

const SOURCE_LABEL = { standard: "Account balance", promo: "Promo bonus", referral: "Referral bonus" };

export async function POST(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
  }

  try {
    const { amount, method, wallet, note, source, planId } = await req.json();
    const numericAmount = Number(amount);
    const withdrawSource = source || "standard";

    if (!numericAmount || numericAmount <= 0) {
      return Response.json({ error: "Please enter a valid withdrawal amount." }, { status: 400 });
    }

    const walletField = COIN_WALLET_FIELDS[method];
    if (!walletField) {
      return Response.json({ error: "Unsupported payment method." }, { status: 400 });
    }

    await connectToDB();
    const user = await User.findById(session.user.id);
    if (!user) return Response.json({ error: "User not found." }, { status: 404 });

    // The wallet must match what's actually saved on the user's own profile
    // — the old endpoint stored whatever address the client sent with no
    // cross-check at all, so a direct API call could redirect funds anywhere.
    const savedWallet = user[walletField];
    if (!savedWallet || savedWallet !== wallet) {
      return Response.json({ error: "This doesn't match your saved payout wallet for that coin." }, { status: 400 });
    }

    if (user.minimumWithdrawal > 0 && numericAmount < user.minimumWithdrawal) {
      return Response.json({ error: `Minimum withdrawal is ${fmt(user.minimumWithdrawal)}.` }, { status: 400 });
    }

    const withdrawId = new mongoose.Types.ObjectId();
    const withdrawEntry = {
      _id: withdrawId,
      amount: numericAmount,
      wallet,
      method,
      note,
      status: "pending",
      source: withdrawSource,
    };

    if (withdrawSource === "promo") {
      if (!user.promoBonus || user.promoBonus < numericAmount) {
        return Response.json({ error: `Insufficient promo balance. Available: ${fmt(user.promoBonus || 0)}` }, { status: 400 });
      }
      if (user.promoWithdrawDate && new Date() < new Date(user.promoWithdrawDate)) {
        return Response.json(
          { error: `Promo withdrawal is not allowed until ${new Date(user.promoWithdrawDate).toLocaleDateString()}` },
          { status: 400 },
        );
      }
      if (user.promoWithdrawAmount > 0 && numericAmount > user.promoWithdrawAmount) {
        return Response.json({ error: `Your maximum allowed promo withdrawal is currently ${fmt(user.promoWithdrawAmount)}` }, { status: 400 });
      }
    } else if (withdrawSource === "referral") {
      // No old-app equivalent for this branch — referral bonus there could
      // only leave via reinvestment. This is withdraw-only per the business
      // rule already built into the dashboard.
      if (!user.referralBonus || user.referralBonus < numericAmount) {
        return Response.json({ error: `Insufficient referral bonus. Available: ${fmt(user.referralBonus || 0)}` }, { status: 400 });
      }
    } else {
      if (!planId) {
        return Response.json({ error: "Please select a plan to withdraw from." }, { status: 400 });
      }
      const plan = user.activeDeposit.id(planId);
      if (!plan) {
        return Response.json({ error: "Selected plan not found." }, { status: 404 });
      }
      // The old endpoint never checked either of these — a direct API call
      // could submit a withdrawal against a still-active or already fully
      // withdrawn plan.
      if (!plan.stopped) {
        return Response.json({ error: "That plan hasn't matured yet." }, { status: 400 });
      }
      if (plan.withdrawn) {
        return Response.json({ error: "That plan has already been withdrawn." }, { status: 400 });
      }
      const planTotal = plan.amount + (plan.profit || 0);
      if (planTotal < numericAmount) {
        return Response.json({ error: `Insufficient balance in selected plan. Available: ${fmt(planTotal)}` }, { status: 400 });
      }
      withdrawEntry.planId = plan._id;
    }

    const updated = await User.findByIdAndUpdate(
      session.user.id,
      { $push: { withdraw: withdrawEntry } },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return Response.json({ error: "User not found." }, { status: 404 });
    }

    sendEmail(
      updated.email,
      "Withdrawal Request Submitted",
      `Hello ${updated.username}, your withdrawal request of ${fmt(numericAmount)} via ${method} has been submitted and is pending review.`,
      renderNotificationEmail({
        heading: "Withdrawal Request Submitted",
        greeting: updated.username,
        message: "Thank you for your withdrawal request. We've received your submission and it's currently under review.",
        badgeText: "Pending Review",
        badgeColor: "#92400e",
        badgeBg: "#fef3c7",
        rows: [
          ["Amount", fmt(numericAmount), true],
          ["Payment Method", method],
          ["Source", SOURCE_LABEL[withdrawSource]],
          ["Wallet", wallet],
          ["Status", "Pending"],
        ],
        noteText: "Your withdrawal will be reviewed shortly. No fees are charged on this operation.",
      }),
    ).catch((err) => console.error("Withdrawal request email failed:", err.message));

    sendPush(session.user.id, {
      title: "Withdrawal submitted",
      body: `Your ${fmt(numericAmount)} withdrawal is pending review.`,
      url: "/dashboard/transactions",
    }).catch((err) => console.error("Withdrawal request push failed:", err.message));

    return Response.json(
      { ok: true, withdraw: { id: withdrawId, amount: numericAmount, method, status: "pending" } },
      { status: 201 },
    );
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
