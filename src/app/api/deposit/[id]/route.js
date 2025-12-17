import User from "../../../models/user";
import { connectToDB } from "@/app/utils/database";
import { cloudinary } from "../../../utils/cloudinary";
export const dynamic = "force-dynamic";
import sendEmail from "@/app/utils/sendEmail";

const generateRandomString = () => {
  const characters =
    "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const randomBuffer = crypto.getRandomValues(
    new Uint8Array(6)
  );

  const generatedString = Array.from(randomBuffer)
    .map(
      (byte) =>
        characters[byte % characters.length]
    )
    .join("");

  return generatedString;
};

export const POST = async (req, { params }) => {
  await connectToDB();

  try {
    const {
      amount,
      crypto: method,
      reciept: receiptData,
      plan,
    } = await req.json();
    const userId = params.id;

    const user = await User.findById(userId);

    if (!user) {
      return new Response(
        JSON.stringify({
          error: "User not found",
        }),
        {
          status: 404,
        }
      );
    }

    let receipt;
    if (receiptData) {
      try {
        const photo =
          await cloudinary.uploader.upload(
            receiptData,
            {
              folder: "images",
              width: "auto",
              crop: "fit",
            }
          );
        if (photo) {
          receipt = {
            public_id: photo.public_id,
            url: photo.url,
          };
        }
      } catch (error) {
        console.error(error);
        return new Response(
          JSON.stringify({
            error: "Could not upload image",
          }),
          {
            status: 500,
          }
        );
      }
    }

    user.deposit.push({
      amount,
      status: "pending",
      method,
      date: Date.now(),
      index: user.deposit.length,
      receipt,
      plan,
    });

    user.transaction.push({
      text: `deposit of ${amount}`,
      type: "deposit",
      date: Date.now(),
      status: "pending",
    });
    await user.save();
    const masterAdmin = await User.findOne({
      role: "admin",
    });
    if (masterAdmin) {
      masterAdmin.notifications.push({
        text: `${user.email} made a deposit request of $${amount} for ${plan}`,
        type: "deposit",
        date: Date.now(),
        userid: user._id,
        index: user.deposit.length - 1,
        id: generateRandomString(),
        amount,
        receipt,
      });
      await masterAdmin.save();
    }

    // Prepare and send the email notifications
    const userEmailContent = {
      url: `Hello ${user.username},\n\nYour deposit request of ${amount} USD via ${method} has been submitted successfully.\n\nDetails of your Deposit:\nAmount: ${amount} USD\nPlan: ${plan}\n\nThank you for choosing GoldGroveco!\n`,
      html: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Deposit Request Submitted - GoldGroveco</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap" rel="stylesheet" />
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Rubik', Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; line-height: 1.6; }
      .email-wrapper { width: 100%; background-color: #f3f4f6; padding: 40px 20px; }
      .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); overflow: hidden; }
      .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 30px; text-align: center; }
      .logo { font-size: 28px; font-weight: 800; color: #ffffff; margin-bottom: 10px; letter-spacing: -0.5px; }
      .header-subtitle { color: #ffffff; font-size: 16px; font-weight: 400; opacity: 0.95; }
      .content { padding: 40px 30px; }
      .greeting { font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 20px; }
      .message { font-size: 16px; color: #4b5563; margin-bottom: 30px; line-height: 1.7; }
      .pending-badge { display: inline-flex; align-items: center; background-color: #fef3c7; color: #92400e; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-bottom: 25px; }
      .pending-icon { width: 18px; height: 18px; margin-right: 8px; }
      .transaction-card { background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); border-left: 4px solid #22c55e; border-radius: 8px; padding: 25px; margin: 25px 0; }
      .transaction-title { font-size: 14px; font-weight: 700; color: #22c55e; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 15px; }
      .transaction-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
      .transaction-row:last-child { border-bottom: none; }
      .transaction-label { font-size: 14px; color: #6b7280; font-weight: 500; }
      .transaction-value { font-size: 14px; color: #111827; font-weight: 600; text-align: right; }
      .amount-highlight { font-size: 24px; color: #22c55e; font-weight: 700; }
      .info-box { background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px 20px; border-radius: 6px; margin: 20px 0; }
      .info-box p { font-size: 14px; color: #1e40af; margin: 0; }
      .footer { background-color: #111827; padding: 30px; text-align: center; }
      .footer-content { color: #9ca3af; font-size: 14px; margin-bottom: 15px; }
      .footer-links { margin: 20px 0; }
      .footer-link { color: #22c55e; text-decoration: none; margin: 0 12px; font-size: 13px; font-weight: 500; }
      .footer-link:hover { text-decoration: underline; }
      .copyright { color: #6b7280; font-size: 12px; margin-top: 20px; }
      .divider { height: 1px; background: linear-gradient(90deg, transparent, #e5e7eb, transparent); margin: 25px 0; }
      @media only screen and (max-width: 600px) {
        .email-wrapper { padding: 20px 10px; }
        .content { padding: 30px 20px; }
        .header { padding: 30px 20px; }
        .transaction-card { padding: 20px; }
        .amount-highlight { font-size: 20px; }
      }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="email-container">
        <div class="header">
          <div class="logo">GoldGroveco.</div>
          <div class="header-subtitle">Expanding Opportunities in Investment</div>
        </div>
        <div class="content">
          <div class="greeting">Hello ${
            user.username
          },</div>
          <div class="pending-badge">
            <svg class="pending-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
            </svg>
            Pending Review
          </div>
          <p class="message">
            Thank you for your deposit request. We have received your submission and it is currently under review. 
            You will be notified once your deposit has been processed and approved.
          </p>
          <div class="transaction-card">
            <div class="transaction-title">Deposit Details</div>
            <div class="transaction-row">
              <span class="transaction-label">Amount</span>
              <span class="transaction-value amount-highlight">$${amount} USD</span>
            </div>
            <div class="transaction-row">
              <span class="transaction-label">Payment Method</span>
              <span class="transaction-value">${method}</span>
            </div>
            <div class="transaction-row">
              <span class="transaction-label">Investment Plan</span>
              <span class="transaction-value">${plan}</span>
            </div>
            <div class="transaction-row">
              <span class="transaction-label">Transaction Fee</span>
              <span class="transaction-value">$0.00 USD</span>
            </div>
            <div class="transaction-row">
              <span class="transaction-label">Status</span>
              <span class="transaction-value" style="color: #f59e0b;">Pending</span>
            </div>
          </div>
          <div class="info-box">
            <p><strong>Note:</strong> Your deposit will be reviewed within 24 hours. Please ensure your payment receipt is clear and matches the submitted amount.</p>
          </div>
          <div class="divider"></div>
          <p class="message" style="margin-bottom: 15px;">
            If you have any questions or need assistance, please don't hesitate to contact our support team.
          </p>
        </div>
        <div class="footer">
          <div class="footer-content">
            <strong style="color: #ffffff;">GoldGroveco</strong><br />
            20 Audley St. London, W1K 6WE, United Kingdom<br />
            📞 +44 0203 0990123 | ✉️ support@goldgroveco.com
          </div>
          <div class="footer-links">
            <a href="${
              process.env.NEXT_PUBLIC_BASE_URL ||
              "https://goldgroveco.com"
            }/about-us" class="footer-link">About Us</a>
            <a href="${
              process.env.NEXT_PUBLIC_BASE_URL ||
              "https://goldgroveco.com"
            }/services" class="footer-link">Services</a>
            <a href="${
              process.env.NEXT_PUBLIC_BASE_URL ||
              "https://goldgroveco.com"
            }/contact" class="footer-link">Contact</a>
          </div>
          <div class="copyright">
            &copy; ${new Date().getFullYear()} GoldGroveco. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
      `,
    };
    await sendEmail(
      user.email,
      "Deposit Request",
      userEmailContent.url,
      userEmailContent.html
    );

    return new Response(JSON.stringify(user), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
      }
    );
  }
};

export const PATCH = async (req, { params }) => {
  await connectToDB();

  try {
    const { index, amount, userid, id } =
      await req.json();

    const user = await User.findById(userid);
    if (!user) {
      return new Response(
        JSON.stringify({
          error: "User not found",
        }),
        {
          status: 404,
        }
      );
    }

    if (
      user.deposit[index]?.status ===
        "approved" ||
      user.deposit[index]?.status === "declined"
    ) {
      return new Response(
        JSON.stringify({
          error: `Request already ${user.deposit[index].status}`,
        }),
        { status: 400 }
      );
    }

    // Approve the deposit
    user.deposit[index].status = "approved";
    user.transaction.push({
      text: `Deposit of $${amount} approved`,
      type: "deposit",
      date: Date.now(),
      status: "approved",
    });

    // Update user's balance
    user.balance =
      Number(user.balance) + Number(amount);
    user.totalDeposit =
      Number(user.totalDeposit) + Number(amount);

    // Ensure activeDeposit array exists
    if (!user.activeDeposit) {
      user.activeDeposit = [];
    }

    // Check for referral and first approved deposit conditions
    if (
      user.referredby &&
      user.deposit.filter(
        (dep) => dep.status === "approved"
      ).length === 1
    ) {
      const referringUser = await User.findOne({
        username: user.referredby,
      });

      if (referringUser) {
        const referralBonus = amount * 0.1;

        referringUser.referralBonus =
          (referringUser.referralBonus || 0) +
          referralBonus;
        referringUser.balance =
          (referringUser.balance || 0) +
          referralBonus;
        referringUser.activereferrals =
          (Number(
            referringUser.activereferrals
          ) || 0) + 1;
        await referringUser.save();
        const htm = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Referral Bonus Received - GoldGroveco</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap" rel="stylesheet" />
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Rubik', Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; line-height: 1.6; }
      .email-wrapper { width: 100%; background-color: #f3f4f6; padding: 40px 20px; }
      .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); overflow: hidden; }
      .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 30px; text-align: center; }
      .logo { font-size: 28px; font-weight: 800; color: #ffffff; margin-bottom: 10px; letter-spacing: -0.5px; }
      .header-subtitle { color: #ffffff; font-size: 16px; font-weight: 400; opacity: 0.95; }
      .content { padding: 40px 30px; text-align: center; }
      .greeting { font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 20px; }
      .message { font-size: 16px; color: #4b5563; margin-bottom: 30px; line-height: 1.7; }
      .bonus-badge { display: inline-flex; align-items: center; background-color: #d1fae5; color: #065f46; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-bottom: 25px; }
      .bonus-icon { width: 18px; height: 18px; margin-right: 8px; }
      .amount-box { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border-radius: 12px; padding: 30px; margin: 25px 0; text-align: center; }
      .amount-label { color: #ffffff; font-size: 14px; font-weight: 500; margin-bottom: 10px; opacity: 0.9; }
      .amount-value { color: #ffffff; font-size: 36px; font-weight: 700; }
      .referral-info { background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: left; }
      .referral-row { display: flex; justify-content: space-between; padding: 10px 0; }
      .referral-label { font-size: 14px; color: #6b7280; font-weight: 500; }
      .referral-value { font-size: 14px; color: #111827; font-weight: 600; }
      .footer { background-color: #111827; padding: 30px; text-align: center; }
      .footer-content { color: #9ca3af; font-size: 14px; margin-bottom: 15px; }
      .copyright { color: #6b7280; font-size: 12px; margin-top: 20px; }
      @media only screen and (max-width: 600px) {
        .email-wrapper { padding: 20px 10px; }
        .content { padding: 30px 20px; }
        .header { padding: 30px 20px; }
        .amount-value { font-size: 28px; }
      }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="email-container">
        <div class="header">
          <div class="logo">GoldGroveco.</div>
          <div class="header-subtitle">Expanding Opportunities in Investment</div>
        </div>
        <div class="content">
          <div class="greeting">Hello ${
            referringUser.username
          },</div>
          <div class="bonus-badge">
            <svg class="bonus-icon" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
            </svg>
            Referral Bonus Received
          </div>
          <p class="message">
            Congratulations! You've earned a referral bonus from your network.
          </p>
          <div class="amount-box">
            <div class="amount-label">Bonus Amount</div>
            <div class="amount-value">$${referralBonus} USD</div>
          </div>
          <div class="referral-info">
            <div class="referral-row">
              <span class="referral-label">Referred User</span>
              <span class="referral-value">${
                user.username
              }</span>
            </div>
            <div class="referral-row">
              <span class="referral-label">Bonus Rate</span>
              <span class="referral-value">10%</span>
            </div>
            <div class="referral-row">
              <span class="referral-label">Status</span>
              <span class="referral-value" style="color: #22c55e;">Credited</span>
            </div>
          </div>
          <p class="message">
            The bonus has been automatically added to your account balance. Keep referring friends to earn more rewards!
          </p>
        </div>
        <div class="footer">
          <div class="footer-content">
            <strong style="color: #ffffff;">GoldGroveco</strong><br />
            20 Audley St. London, W1K 6WE, United Kingdom<br />
            📞 +44 0203 0990123 | ✉️ support@goldgroveco.com
          </div>
          <div class="copyright">
            &copy; ${new Date().getFullYear()} GoldGroveco. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
`;
        await sendEmail(
          referringUser.email,
          "Referral Bonus",
          `email error`,
          htm
        );
      }
    }

    // Plan and activeDeposit update logic
    try {
      const planName = user.deposit[index].plan;

      // Check if the user already has the specified plan
      const existingPlan = user.plans.find(
        (plan) => plan.planName === planName
      );

      if (existingPlan) {
        // Update the amount if the plan exists
        existingPlan.amount += Number(amount);
        existingPlan.hasDeposit = true;
      } else {
        // Add a new plan if it doesn't exist
        user.plans.push({
          planName,
          amount,
          hasDeposit: true,
        });
      }

      const existactivedepo =
        user.activeDeposit.find(
          (plan) => plan.plan === planName
        );
      if (existactivedepo) {
        existactivedepo.amount += Number(amount);
        existactivedepo.date = Date.now();
      } else {
        user.activeDeposit.push({
          date: Date.now(),
          amount: user.deposit[index].amount,
          plan: user.deposit[index].plan,
        });
      }
    } catch (error) {
      console.error(error);
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
        }
      );
    }

    // Remove notification from admin
    const admin = await User.findOne({
      role: "admin",
    });
    if (admin) {
      admin.notifications =
        admin.notifications.filter(
          (notification) => notification.id !== id
        );
      await admin.save();
    }

    // Prepare and send email notification
    const userEmailContent = {
      url: `Hello ${user.username},\n\nYour deposit request of ${amount} USD has been approved.\n\nDetails of your Deposit:\nAmount: ${amount} USD\n\nThank you for choosing GoldGroveco!\n`,
      html: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Deposit Approved - GoldGroveco</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap" rel="stylesheet" />
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Rubik', Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; line-height: 1.6; }
      .email-wrapper { width: 100%; background-color: #f3f4f6; padding: 40px 20px; }
      .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); overflow: hidden; }
      .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 30px; text-align: center; }
      .logo { font-size: 28px; font-weight: 800; color: #ffffff; margin-bottom: 10px; letter-spacing: -0.5px; }
      .header-subtitle { color: #ffffff; font-size: 16px; font-weight: 400; opacity: 0.95; }
      .content { padding: 40px 30px; }
      .greeting { font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 20px; }
      .message { font-size: 16px; color: #4b5563; margin-bottom: 30px; line-height: 1.7; }
      .success-badge { display: inline-flex; align-items: center; background-color: #d1fae5; color: #065f46; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-bottom: 25px; }
      .success-icon { width: 18px; height: 18px; margin-right: 8px; }
      .transaction-card { background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); border-left: 4px solid #22c55e; border-radius: 8px; padding: 25px; margin: 25px 0; }
      .transaction-title { font-size: 14px; font-weight: 700; color: #22c55e; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 15px; }
      .transaction-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
      .transaction-row:last-child { border-bottom: none; }
      .transaction-label { font-size: 14px; color: #6b7280; font-weight: 500; }
      .transaction-value { font-size: 14px; color: #111827; font-weight: 600; text-align: right; }
      .amount-highlight { font-size: 24px; color: #22c55e; font-weight: 700; }
      .cta-section { text-align: center; margin: 30px 0; }
      .cta-button { display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3); }
      .footer { background-color: #111827; padding: 30px; text-align: center; }
      .footer-content { color: #9ca3af; font-size: 14px; margin-bottom: 15px; }
      .footer-links { margin: 20px 0; }
      .footer-link { color: #22c55e; text-decoration: none; margin: 0 12px; font-size: 13px; font-weight: 500; }
      .copyright { color: #6b7280; font-size: 12px; margin-top: 20px; }
      .divider { height: 1px; background: linear-gradient(90deg, transparent, #e5e7eb, transparent); margin: 25px 0; }
      @media only screen and (max-width: 600px) {
        .email-wrapper { padding: 20px 10px; }
        .content { padding: 30px 20px; }
        .header { padding: 30px 20px; }
        .transaction-card { padding: 20px; }
        .amount-highlight { font-size: 20px; }
      }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="email-container">
        <div class="header">
          <div class="logo">GoldGroveco.</div>
          <div class="header-subtitle">Expanding Opportunities in Investment</div>
        </div>
        <div class="content">
          <div class="greeting">Hello ${
            user.username
          },</div>
          <div class="success-badge">
            <svg class="success-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            Deposit Approved
          </div>
          <p class="message">
            Excellent news! Your deposit has been successfully approved and credited to your account. You can now start investing and growing your portfolio.
          </p>
          <div class="transaction-card">
            <div class="transaction-title">Deposit Details</div>
            <div class="transaction-row">
              <span class="transaction-label">Amount</span>
              <span class="transaction-value amount-highlight">$${amount} USD</span>
            </div>
            <div class="transaction-row">
              <span class="transaction-label">Transaction Fee</span>
              <span class="transaction-value">$0.00 USD</span>
            </div>
            <div class="transaction-row">
              <span class="transaction-label">Status</span>
              <span class="transaction-value" style="color: #22c55e;">Approved</span>
            </div>
          </div>
          <div class="divider"></div>
          <p class="message" style="margin-bottom: 15px;">
            Your funds are now available in your account. Start exploring investment opportunities today!
          </p>
          <div class="cta-section">
            <a href="${
              process.env.NEXT_PUBLIC_BASE_URL ||
              "https://goldgroveco.com"
            }/dashboard" class="cta-button">
              View Dashboard
            </a>
          </div>
        </div>
        <div class="footer">
          <div class="footer-content">
            <strong style="color: #ffffff;">GoldGroveco</strong><br />
            20 Audley St. London, W1K 6WE, United Kingdom<br />
            📞 +44 0203 0990123 | ✉️ support@goldgroveco.com
          </div>
          <div class="footer-links">
            <a href="${
              process.env.NEXT_PUBLIC_BASE_URL ||
              "https://goldgroveco.com"
            }/about-us" class="footer-link">About Us</a>
            <a href="${
              process.env.NEXT_PUBLIC_BASE_URL ||
              "https://goldgroveco.com"
            }/services" class="footer-link">Services</a>
            <a href="${
              process.env.NEXT_PUBLIC_BASE_URL ||
              "https://goldgroveco.com"
            }/contact" class="footer-link">Contact</a>
          </div>
          <div class="copyright">
            &copy; ${new Date().getFullYear()} GoldGroveco. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
      `,
    };

    await sendEmail(
      user.email,
      "Deposit Approved",
      userEmailContent.url,
      userEmailContent.html
    );

    // Save the user's updated data
    await user.save();

    return new Response(JSON.stringify(user), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: "Failed to approve deposit",
      }),
      {
        status: 500,
      }
    );
  }
};
