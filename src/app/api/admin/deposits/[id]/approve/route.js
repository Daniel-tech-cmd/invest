import { auth } from "../../../../../../auth";
import { connectToDB } from "../../../../../../lib/db";
import User from "../../../../../../models/User";
import sendEmail from "../../../../../../lib/sendEmail";
import sendPush from "../../../../../../lib/sendPush";
import { renderNotificationEmail } from "../../../../../../lib/emailTemplates";

const fmt = (n) => `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export async function POST(req, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
  }
  if (session.user.role !== "admin" && session.user.role !== "master admin") {
    return Response.json({ error: "Admin access required." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const { userId } = await req.json();

    await connectToDB();
    const user = await User.findById(userId);
    if (!user) return Response.json({ error: "User not found." }, { status: 404 });

    const dep = user.deposit.id(id);
    if (!dep) return Response.json({ error: "Deposit request not found." }, { status: 404 });
    if (dep.status !== "pending") {
      return Response.json({ error: `Request already ${dep.status}.` }, { status: 400 });
    }

    const amount = dep.amount;
    const planName = dep.plan;

    // Referral bonus fires only on the referred user's very first approved
    // deposit, not every one — matches the old app's rule exactly.
    const isFirstApproval = user.deposit.filter((d) => d.status === "approved").length === 0;
    if (isFirstApproval && user.referredby) {
      const referrer = await User.findOne({ username: user.referredby });
      if (referrer) {
        const referralBonus = amount * 0.1;
        // Falls back to the old app's real field name (`name` instead of
        // `username`) for a referral entry created before this account was
        // migrated — direct property access returns undefined for a field
        // not declared in the schema, even though it's still in the raw
        // stored document, so .get() is needed to reach it.
        const refIdx = referrer.referals.findIndex((r) => (r.username || r.get("name")) === user.username);
        const referrerUpdate = {
          $inc: { referralBonus, balance: referralBonus, activereferrals: 1 },
          $push: { bonusHistory: { type: "referral", amount: referralBonus, note: `Referral bonus from ${user.username}'s first deposit` } },
        };
        if (refIdx !== -1) referrerUpdate.$set = { [`referals.${refIdx}.verified`]: true };
        await User.findByIdAndUpdate(referrer._id, referrerUpdate);

        sendEmail(
          referrer.email,
          "Referral Bonus Received",
          `You've earned a ${fmt(referralBonus)} referral bonus from ${user.username}'s first approved deposit.`,
          renderNotificationEmail({
            heading: "Referral Bonus Received",
            greeting: referrer.username,
            message: `You've earned a referral bonus from ${user.username}'s first approved deposit.`,
            badgeText: "Bonus Earned",
            rows: [
              ["Bonus amount", fmt(referralBonus), true],
              ["From", user.username],
            ],
          }),
        ).catch((err) => console.error("Referral bonus email failed:", err.message));

        sendPush(referrer._id, {
          title: "Referral bonus earned",
          body: `You earned ${fmt(referralBonus)} from ${user.username}'s first deposit.`,
          url: "/dashboard/referrals",
        }).catch((err) => console.error("Referral bonus push failed:", err.message));
      }
    }

    // Every approved deposit gets its own activeDeposit entry — never merged
    // into an existing one for the same plan, matured or not. Merging would
    // reset the maturity clock for the combined total, penalizing a user for
    // depositing again while an earlier deposit is still counting down.
    const updated = await User.findOneAndUpdate(
      { _id: userId, deposit: { $elemMatch: { _id: id, status: "pending" } } },
      {
        $set: { "deposit.$.status": "approved" },
        $inc: { balance: amount, totalDeposit: amount },
        $push: {
          activeDeposit: { plan: planName, amount, method: dep.method, date: new Date(), stopped: false, withdrawn: false, lastAccruedAt: new Date() },
        },
      },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return Response.json({ error: "This request was already processed." }, { status: 409 });
    }

    sendEmail(
      updated.email,
      "Deposit Approved",
      `Hello ${updated.username}, your deposit of ${fmt(amount)} has been approved.`,
      renderNotificationEmail({
        heading: "Deposit Approved",
        greeting: updated.username,
        message: "Your deposit has been approved and credited to your account. You can now start earning on it.",
        badgeText: "Approved",
        rows: [
          ["Amount", fmt(amount), true],
          ["Plan", planName],
          ["Status", "Approved"],
        ],
        ctaText: "View Dashboard",
        ctaUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
      }),
    ).catch((err) => console.error("Deposit approval email failed:", err.message));

    sendPush(userId, {
      title: "Deposit approved",
      body: `Your ${fmt(amount)} deposit into ${planName} is now active.`,
      url: "/dashboard",
    }).catch((err) => console.error("Deposit approval push failed:", err.message));

    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
