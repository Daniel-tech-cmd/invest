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

    const wd = user.withdraw.id(id);
    if (!wd) return Response.json({ error: "Withdrawal request not found." }, { status: 404 });
    if (wd.status !== "pending") {
      return Response.json({ error: `Request already ${wd.status}.` }, { status: 400 });
    }

    const amount = wd.amount;
    const query = { _id: userId, withdraw: { $elemMatch: { _id: id, status: "pending" } } };
    const update = {
      $set: { "withdraw.$.status": "approved" },
      $inc: { totalWithdraw: amount },
    };
    const options = { new: true, runValidators: true };

    if (wd.source === "promo") {
      if ((user.promoBonus || 0) < amount) {
        return Response.json({ error: `Insufficient promo balance. Available: ${fmt(user.promoBonus || 0)}` }, { status: 400 });
      }
      update.$inc.promoBonus = -amount;
    } else if (wd.source === "referral") {
      // No old-app equivalent — referral bonus is credited straight into
      // balance when it's earned (see reinvest/deposit-approve), so
      // withdrawing it draws down both fields together.
      if ((user.referralBonus || 0) < amount) {
        return Response.json({ error: `Insufficient referral bonus. Available: ${fmt(user.referralBonus || 0)}` }, { status: 400 });
      }
      update.$set.referralBonus = Math.max(0, (user.referralBonus || 0) - amount);
      update.$set.balance = Math.max(0, (user.balance || 0) - amount);
    } else {
      const plan = user.activeDeposit.id(wd.planId);
      if (!plan) return Response.json({ error: "Selected plan no longer exists." }, { status: 404 });

      const planTotal = plan.amount + (plan.profit || 0);
      if (planTotal < amount) {
        return Response.json({ error: `Insufficient balance in selected plan. Available: ${fmt(planTotal)}` }, { status: 400 });
      }

      // Profit is drawn down first, then principal — matches the old app.
      const currentProfit = plan.profit || 0;
      const profitWithdrawn = Math.min(currentProfit, amount);
      const principalWithdrawn = amount - profitWithdrawn;
      const newProfit = currentProfit - profitWithdrawn;
      const newAmount = plan.amount - principalWithdrawn;
      const balanceDeducted = plan.balanceDeductedAmount || 0;

      update.$set["activeDeposit.$[p].profit"] = newProfit;
      update.$set["activeDeposit.$[p].amount"] = newAmount;
      if (newAmount + newProfit <= 0) {
        update.$set["activeDeposit.$[p].withdrawn"] = true;
      }

      if (profitWithdrawn > 0) {
        update.$set.profit = Math.max(0, (user.profit || 0) - profitWithdrawn);
      }

      if (balanceDeducted > 0) {
        // This plan's principal came from a reinvestment, so it was never
        // counted in balance in the first place — only the profit portion
        // being withdrawn now was ever spendable.
        update.$set.balance = Math.max(0, (user.balance || 0) - profitWithdrawn);
        if (principalWithdrawn > 0) {
          update.$inc["activeDeposit.$[p].balanceDeductedAmount"] = -principalWithdrawn;
        }
      } else {
        update.$set.balance = Math.max(0, (user.balance || 0) - amount);
      }

      options.arrayFilters = [{ "p._id": plan._id }];
    }

    const updated = await User.findOneAndUpdate(query, update, options);
    if (!updated) {
      return Response.json({ error: "This request was already processed." }, { status: 409 });
    }

    sendEmail(
      updated.email,
      "Withdrawal Approved",
      `Hello ${updated.username}, your withdrawal of ${fmt(amount)} has been approved.`,
      renderNotificationEmail({
        heading: "Withdrawal Approved",
        greeting: updated.username,
        message: "Your withdrawal request has been successfully processed. The funds have been sent to your designated wallet address.",
        badgeText: "Approved",
        rows: [
          ["Amount", fmt(amount), true],
          ["Wallet", wd.wallet],
          ["Status", "Approved"],
        ],
        ctaText: "View Dashboard",
        ctaUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
      }),
    ).catch((err) => console.error("Withdrawal approval email failed:", err.message));

    sendPush(userId, {
      title: "Withdrawal approved",
      body: `Your ${fmt(amount)} withdrawal has been sent.`,
      url: "/dashboard/transactions",
    }).catch((err) => console.error("Withdrawal approval push failed:", err.message));

    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
