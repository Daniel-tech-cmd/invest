import User from "../../../models/user";
import { connectToDB } from "@/app/utils/database";
import sendEmail from "@/app/utils/sendEmail";

const generateRandomString = () => {
  const characters = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomBuffer = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(randomBuffer)
    .map((byte) => characters[byte % characters.length])
    .join("");
};

export const POST = async (req, { params }) => {
  await connectToDB();

  try {
    const { amount, coin, note, wallet, planIndex } = await req.json();
    const { id: userId } = await params;

    const user = await User.findById(userId);

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    if (planIndex === "promo") {
      if (!user.promoBonus || user.promoBonus < amount) {
        return new Response(
          JSON.stringify({ error: `Insufficient promo balance. Available: $${(user.promoBonus || 0).toFixed(2)}` }),
          { status: 400 }
        );
      }
      if (user.promoWithdrawDate && new Date() < new Date(user.promoWithdrawDate)) {
        return new Response(
          JSON.stringify({ error: `Promo withdrawal is not allowed until ${new Date(user.promoWithdrawDate).toLocaleDateString()}` }),
          { status: 400 }
        );
      }
      if (user.promoWithdrawAmount !== undefined && user.promoWithdrawAmount !== null && user.promoWithdrawAmount > 0 && amount > user.promoWithdrawAmount) {
        return new Response(
          JSON.stringify({ error: `Your maximum allowed promo withdrawal is currently $${user.promoWithdrawAmount.toFixed(2)}` }),
          { status: 400 }
        );
      }
    } else {
      if (planIndex === undefined || planIndex === null) {
        return new Response(JSON.stringify({ error: "Please select a plan to withdraw from" }), { status: 400 });
      }
      if (!user.activeDeposit || !user.activeDeposit[planIndex]) {
        return new Response(JSON.stringify({ error: "Selected plan not found" }), { status: 404 });
      }
      const selectedPlan = user.activeDeposit[planIndex];
      const planTotalBalance = selectedPlan.amount + (selectedPlan.profit || 0);
      if (planTotalBalance < amount) {
        return new Response(
          JSON.stringify({ error: `Insufficient balance in selected plan. Available: $${planTotalBalance.toFixed(2)}` }),
          { status: 400 }
        );
      }
    }

    const notifId = generateRandomString();

    // Atomic update — no version conflict
    await User.findByIdAndUpdate(userId, {
      $push: {
        withdraw: {
          amount,
          status: "pending",
          method: coin,
          date: Date.now(),
          wallet,
          note,
          planIndex,
        },
        transaction: {
          text: `Withdrawal of ${amount}`,
          type: "withdrawal",
          date: Date.now(),
          status: "pending",
        },
      },
    });

    await User.updateOne(
      { role: "admin" },
      {
        $push: {
          notifications: {
            text: `${user.email} made a withdrawal request of $${amount} via ${coin}`,
            type: "withdrawal",
            date: Date.now(),
            index: user.withdraw.length,
            userid: user._id,
            id: notifId,
            amount,
          },
        },
      }
    );

    const updatedUser = await User.findById(userId);

    sendEmail(
      user.email,
      "Withdrawal Request",
      `Hello ${user.username}, your withdrawal request of ${amount} USD via ${coin} has been submitted successfully.`,
      `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Withdrawal Confirmation</title>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
      .email-container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
      .header { text-align: center; padding: 10px 0; background-color: #1daad9; color: #ffffff; border-radius: 8px 8px 0 0; }
      .header h1 { margin: 0; font-size: 24px; }
      .content { margin: 20px 0; }
      .content p { font-size: 16px; color: #333333; line-height: 1.6; }
      .footer { text-align: center; padding: 15px; color: #ffffff; background-color: #1daad9; font-size: 14px; border-radius: 0 0 8px 8px; }
      .footer a { color: #ffffff; text-decoration: none; }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header"><h1>Withdrawal Confirmation</h1></div>
      <div class="content">
        <p>Hello ${user.username},</p>
        <p>Your withdrawal request of <strong>${amount} USD</strong> via <strong>${coin}</strong> has been submitted successfully.</p>
        <p><strong>Withdrawal Details:</strong><br />Amount: ${amount} USD<br />Note: ${note || "No additional note provided"}</p>
        <p>Thank you for choosing GoldGroveco!</p>
      </div>
      <div class="footer">&copy; ${new Date().getFullYear()} GoldGroveco. All rights reserved. | <a href="https://www.goldgroveco.com/">Visit our website</a></div>
    </div>
  </body>
</html>`
    ).catch((err) => console.error("Withdrawal request email failed:", err.message));

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const PATCH = async (req, { params }) => {
  await connectToDB();
  const { id: adminId } = await params;

  try {
    const isadmin = await User.findById(adminId);
    if (!isadmin || isadmin.role !== "admin") {
      return new Response(JSON.stringify({ error: "You are not an admin!" }), { status: 401 });
    }

    const { index, amount, userid, id } = await req.json();

    const user = await User.findById(userid);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    if (user.withdraw[index]?.status === "approved" || user.withdraw[index]?.status === "declined") {
      return new Response(
        JSON.stringify({ error: `Request already ${user.withdraw[index].status}` }),
        { status: 400 }
      );
    }

    const planIndex = user.withdraw[index].planIndex;

    // Build atomic update ops — avoids VersionError entirely
    const updateOps = {
      $set: { [`withdraw.${index}.status`]: "approved" },
      $push: {
        transaction: {
          text: `Withdrawal of $${amount} approved`,
          type: "withdrawal",
          date: Date.now(),
          status: "approved",
        },
      },
      $inc: { totalWithdraw: Number(amount) },
    };

    if (planIndex === "promo") {
      if ((user.promoBonus || 0) < amount) {
        return new Response(
          JSON.stringify({ error: `Insufficient promo balance. Available: $${(user.promoBonus || 0).toFixed(2)}` }),
          { status: 400 }
        );
      }
      updateOps.$inc.promoBonus = -Number(amount);
    } else if (planIndex !== undefined && planIndex !== null) {
      if (!user.activeDeposit || !user.activeDeposit[planIndex]) {
        return new Response(JSON.stringify({ error: "Selected plan no longer exists" }), { status: 404 });
      }

      const planTotalBalance =
        user.activeDeposit[planIndex].amount + (user.activeDeposit[planIndex].profit || 0);
      if (planTotalBalance < amount) {
        return new Response(
          JSON.stringify({ error: `Insufficient balance in selected plan. Available: $${planTotalBalance.toFixed(2)}` }),
          { status: 400 }
        );
      }

      const currentProfit = user.activeDeposit[planIndex].profit || 0;
      let newProfit, newAmount;
      if (currentProfit >= Number(amount)) {
        newProfit = currentProfit - Number(amount);
        newAmount = user.activeDeposit[planIndex].amount;
      } else {
        newProfit = 0;
        newAmount = user.activeDeposit[planIndex].amount - (Number(amount) - currentProfit);
      }

      const profitWithdrawn = Math.min(currentProfit, Number(amount));
      const principalWithdrawn = Number(amount) - profitWithdrawn;
      const balanceDeductedAmountForPlan =
        user.activeDeposit[planIndex].balanceDeductedAmount || 0;

      updateOps.$set[`activeDeposit.${planIndex}.profit`] = newProfit;
      updateOps.$set[`activeDeposit.${planIndex}.amount`] = newAmount;

      if (newAmount + newProfit <= 0) {
        updateOps.$set[`activeDeposit.${planIndex}.withdrawn`] = true;
      }

      // Sync user.profit: deduct the plan profit consumed in this withdrawal
      if (profitWithdrawn > 0) {
        updateOps.$set.profit = Math.max(0, (user.profit || 0) - profitWithdrawn);
      }

      if (balanceDeductedAmountForPlan > 0) {
        // Reinvested plan — principal was never in balance, only deduct the profit portion
        updateOps.$set.balance = Math.max(0, Number(user.balance) - profitWithdrawn);
        // Reduce balanceDeductedAmount so only the remaining principal returns when plan stops
        if (principalWithdrawn > 0) {
          updateOps.$inc[`activeDeposit.${planIndex}.balanceDeductedAmount`] = -principalWithdrawn;
        }
      } else {
        // Original deposit — full amount was in balance
        updateOps.$set.balance = Math.max(0, Number(user.balance) - Number(amount));
      }
    }

    // Atomic save — no version conflict
    const updatedUser = await User.findByIdAndUpdate(userid, updateOps, { new: true });

    // Remove notification from admin atomically
    await User.updateOne({ role: "admin" }, { $pull: { notifications: { id } } });

    // Fire-and-forget email — response is not blocked
    sendEmail(
      user.email,
      "Withdrawal Approved",
      `Hello ${user.username}, your withdrawal of $${amount} USD has been approved.`,
      `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Withdrawal Approved - GoldGroveco</title>
    <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap" rel="stylesheet" />
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Rubik', Arial, sans-serif; background-color: #f3f4f6; line-height: 1.6; }
      .email-wrapper { width: 100%; background-color: #f3f4f6; padding: 40px 20px; }
      .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; }
      .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 30px; text-align: center; }
      .logo { font-size: 28px; font-weight: 800; color: #ffffff; margin-bottom: 10px; }
      .content { padding: 40px 30px; }
      .greeting { font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 20px; }
      .message { font-size: 16px; color: #4b5563; margin-bottom: 30px; line-height: 1.7; }
      .success-badge { display: inline-flex; align-items: center; background-color: #d1fae5; color: #065f46; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-bottom: 25px; }
      .transaction-card { background: #f9fafb; border-left: 4px solid #22c55e; border-radius: 8px; padding: 25px; margin: 25px 0; }
      .transaction-title { font-size: 14px; font-weight: 700; color: #22c55e; text-transform: uppercase; margin-bottom: 15px; }
      .transaction-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
      .transaction-row:last-child { border-bottom: none; }
      .transaction-label { font-size: 14px; color: #6b7280; }
      .transaction-value { font-size: 14px; color: #111827; font-weight: 600; }
      .amount-highlight { font-size: 24px; color: #22c55e; font-weight: 700; }
      .footer { background-color: #111827; padding: 30px; text-align: center; }
      .footer-content { color: #9ca3af; font-size: 14px; }
      .copyright { color: #6b7280; font-size: 12px; margin-top: 15px; }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="email-container">
        <div class="header"><div class="logo">GoldGroveco.</div></div>
        <div class="content">
          <div class="greeting">Hello ${user.username},</div>
          <div class="success-badge">Withdrawal Approved</div>
          <p class="message">Your withdrawal request has been successfully processed. The funds have been sent to your designated wallet address.</p>
          <div class="transaction-card">
            <div class="transaction-title">Withdrawal Details</div>
            <div class="transaction-row"><span class="transaction-label">Amount</span><span class="transaction-value amount-highlight">$${amount} USD</span></div>
            <div class="transaction-row"><span class="transaction-label">Wallet Address</span><span class="transaction-value">${user.withdraw[index].wallet}</span></div>
            <div class="transaction-row"><span class="transaction-label">Status</span><span class="transaction-value" style="color:#22c55e;">Completed</span></div>
          </div>
        </div>
        <div class="footer">
          <div class="footer-content"><strong style="color:#ffffff;">GoldGroveco</strong><br />support@goldgroveco.com</div>
          <div class="copyright">&copy; ${new Date().getFullYear()} GoldGroveco. All rights reserved.</div>
        </div>
      </div>
    </div>
  </body>
</html>`
    ).catch((err) => console.error("Withdrawal approval email failed:", err.message));

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error("=== WITHDRAWAL APPROVAL ERROR ===");
    console.error("Error message:", error.message);
    console.error("================================");
    return new Response(
      JSON.stringify({ error: "Failed to approve withdrawal", details: error.message }),
      { status: 500 }
    );
  }
};
