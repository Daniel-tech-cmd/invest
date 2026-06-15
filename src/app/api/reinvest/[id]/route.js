import User from "../../../models/user";
import { connectToDB } from "@/app/utils/database";
export const dynamic = "force-dynamic";
import sendEmail from "@/app/utils/sendEmail";

const PLAN_MINIMUMS = {
  "Basic Plan": 100,
  "Standard Plan": 500,
  "Advanced Plan": 5000,
  "Silver Plan": 10000,
  "Gold Plan": 20000,
};

export const POST = async (req, { params }) => {
  await connectToDB();
  try {
    const body = await req.json();
    const { id: userId } = await params;

    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // ── Promo reinvest branch ──────────────────────────────────────────────
    if (body.source === "promo") {
      const { planName, amount } = body;

      const minimum = PLAN_MINIMUMS[planName];
      if (!minimum) {
        return new Response(JSON.stringify({ error: "Invalid plan selected" }), { status: 400 });
      }

      if (Number(amount) < minimum) {
        return new Response(
          JSON.stringify({ error: `Minimum investment for ${planName} is $${minimum.toLocaleString()}` }),
          { status: 400 }
        );
      }

      if (!user.promoBonus || user.promoBonus < Number(amount)) {
        return new Response(
          JSON.stringify({
            error: `Insufficient promo balance. Available: $${(user.promoBonus || 0).toFixed(2)}`,
          }),
          { status: 400 }
        );
      }

      const existingActive = user.activeDeposit.find(
        (d) => d.plan === planName && !d.stopped
      );
      const existingActiveIdx = existingActive
        ? user.activeDeposit.indexOf(existingActive)
        : -1;

      const updateOps = {
        $inc: { promoBonus: -Number(amount) },
        $push: {
          deposit: {
            amount: Number(amount),
            status: "approved",
            method: "promo reinvestment",
            date: Date.now(),
            index: user.deposit.length,
            plan: planName,
          },
          transaction: {
            text: `Promo reinvestment of $${amount} into ${planName}`,
            type: "reinvestment",
            date: Date.now(),
            status: "approved",
          },
        },
      };

      if (existingActive) {
        updateOps.$set = {
          [`activeDeposit.${existingActiveIdx}.amount`]:
            existingActive.amount + Number(amount),
          [`activeDeposit.${existingActiveIdx}.date`]: Date.now(),
          [`activeDeposit.${existingActiveIdx}.stopped`]: false,
        };
      } else {
        updateOps.$push.activeDeposit = {
          date: Date.now(),
          amount: Number(amount),
          plan: planName,
          method: "promo",
        };
      }

      const updatedUser = await User.findByIdAndUpdate(userId, updateOps, { new: true });

      sendEmail(
        user.email,
        "Promo Reinvestment Successful — GoldGroveco",
        `Hello ${user.username}, your promo reinvestment of $${amount} into ${planName} was successful.`,
        `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Promo Reinvestment Successful - GoldGroveco</title>
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
          <div class="success-badge">Promo Reinvestment Successful</div>
          <p class="message">Your promo bonus has been successfully reinvested. Your investment is now active and earning returns.</p>
          <div class="transaction-card">
            <div class="transaction-title">Reinvestment Details</div>
            <div class="transaction-row"><span class="transaction-label">Amount</span><span class="transaction-value amount-highlight">$${amount} USD</span></div>
            <div class="transaction-row"><span class="transaction-label">Plan</span><span class="transaction-value">${planName}</span></div>
            <div class="transaction-row"><span class="transaction-label">Source</span><span class="transaction-value">Promo Bonus</span></div>
            <div class="transaction-row"><span class="transaction-label">Status</span><span class="transaction-value" style="color:#22c55e;">Active</span></div>
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
      ).catch((err) => console.error("Promo reinvest email failed:", err.message));

      return new Response(JSON.stringify(updatedUser), { status: 200 });
    }

    // ── Normal profit + referral reinvest branch ───────────────────────────
    const { planName, amount } = body;

    const minimum = PLAN_MINIMUMS[planName];
    if (!minimum) {
      return new Response(JSON.stringify({ error: "Invalid plan selected" }), { status: 400 });
    }

    if (Number(amount) < minimum) {
      return new Response(
        JSON.stringify({ error: `Minimum investment for ${planName} is $${minimum.toLocaleString()}` }),
        { status: 400 }
      );
    }

    const availableBalance = user.balance || 0;
    if (availableBalance < Number(amount)) {
      return new Response(
        JSON.stringify({
          error: `Insufficient balance. Available: $${availableBalance.toFixed(2)}`,
        }),
        { status: 400 }
      );
    }

    // Deduct profit first, then referralBonus, then principal (all from balance)
    const profitDeduct = Math.min(user.profit || 0, Number(amount));
    const remaining = Number(amount) - profitDeduct;
    const referralDeduct = Math.min(user.referralBonus || 0, remaining);
    const newProfit = (user.profit || 0) - profitDeduct;
    const newReferralBonus = (user.referralBonus || 0) - referralDeduct;
    const newBalance = (user.balance || 0) - Number(amount);

    // Find existing deposit for this plan (active or stopped)
    const existingDeposit = user.activeDeposit.find((d) => d.plan === planName);
    const existingDepIdx = existingDeposit ? user.activeDeposit.indexOf(existingDeposit) : -1;

    const updateOps = {
      $set: { profit: newProfit, referralBonus: newReferralBonus, balance: newBalance },
      $push: {
        deposit: {
          amount: Number(amount),
          status: "approved",
          method: "reinvestment",
          date: Date.now(),
          index: user.deposit.length,
          plan: planName,
        },
        transaction: {
          text: `Reinvestment of $${amount} into ${planName}`,
          type: "reinvestment",
          date: Date.now(),
          status: "approved",
        },
      },
    };

    if (existingDeposit) {
      // Add to existing deposit (restart if stopped)
      updateOps.$set[`activeDeposit.${existingDepIdx}.amount`] =
        existingDeposit.amount + Number(amount);
      updateOps.$set[`activeDeposit.${existingDepIdx}.date`] = Date.now();
      updateOps.$set[`activeDeposit.${existingDepIdx}.stopped`] = false;
    } else {
      // Create a new active deposit entry for this plan
      updateOps.$push.activeDeposit = {
        date: Date.now(),
        amount: Number(amount),
        plan: planName,
        method: "reinvestment",
      };
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateOps, { new: true });

    sendEmail(
      user.email,
      "Re-investment Successful — GoldGroveco",
      `Hello ${user.username}, your reinvestment of $${amount} USD into ${planName} was successful.`,
      `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reinvestment Successful - GoldGroveco</title>
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
          <div class="success-badge">Reinvestment Successful</div>
          <p class="message">Your profits have been reinvested and your plan is now active again.</p>
          <div class="transaction-card">
            <div class="transaction-title">Reinvestment Details</div>
            <div class="transaction-row"><span class="transaction-label">Amount</span><span class="transaction-value amount-highlight">$${amount} USD</span></div>
            <div class="transaction-row"><span class="transaction-label">Plan</span><span class="transaction-value">${planName}</span></div>
            <div class="transaction-row"><span class="transaction-label">Status</span><span class="transaction-value" style="color:#22c55e;">Active</span></div>
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
    ).catch((err) => console.error("Reinvestment email failed:", err.message));

    // Referral bonus on reinvestment (atomic)
    if (user.referredby) {
      const referringUser = await User.findOne({ username: user.referredby });
      if (referringUser) {
        const referralBonus = amount * 0.1;
        await User.findByIdAndUpdate(referringUser._id, {
          $inc: { referralBonus, balance: referralBonus },
        });
        sendEmail(
          referringUser.email,
          "Referral Bonus — Goldgroveco",
          `You have earned a $${referralBonus} referral bonus from ${user.username}'s reinvestment!`,
          `<p>Hello ${referringUser.username}, you've earned a $${referralBonus} referral bonus.</p>`
        ).catch((err) => console.error("Referral bonus email failed:", err.message));
      }
    }

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
