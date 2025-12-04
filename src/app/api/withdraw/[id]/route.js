import User from "../../../models/user";
import { connectToDB } from "@/app/utils/database";
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
      coin,
      note,
      wallet,
      planIndex,
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

    // Validate planIndex
    if (
      planIndex === undefined ||
      planIndex === null
    ) {
      return new Response(
        JSON.stringify({
          error:
            "Please select a plan to withdraw from",
        }),
        {
          status: 400,
        }
      );
    }

    // Check if the selected plan exists
    if (
      !user.activeDeposit ||
      !user.activeDeposit[planIndex]
    ) {
      return new Response(
        JSON.stringify({
          error: "Selected plan not found",
        }),
        {
          status: 404,
        }
      );
    }

    const selectedPlan =
      user.activeDeposit[planIndex];

    // Check if the selected plan has enough balance
    if (selectedPlan.amount < amount) {
      return new Response(
        JSON.stringify({
          error:
            "Insufficient balance in selected plan",
        }),
        {
          status: 400,
        }
      );
    }

    // Check if user has enough balance in the selected coin/method
    const totalDepositsForCoin = user.deposit
      .filter(
        (deposit) =>
          deposit.method.toLowerCase() ===
            coin.toLowerCase() &&
          deposit.status === "approved"
      )
      .reduce(
        (sum, deposit) => sum + deposit.amount,
        0
      );

    const totalWithdrawalsForCoin = user.withdraw
      .filter(
        (withdrawal) =>
          withdrawal.method.toLowerCase() ===
            coin.toLowerCase() &&
          withdrawal.status === "approved"
      )
      .reduce(
        (sum, withdrawal) =>
          sum + withdrawal.amount,
        0
      );

    const availableCoinBalance =
      totalDepositsForCoin -
      totalWithdrawalsForCoin;

    if (availableCoinBalance < amount) {
      return new Response(
        JSON.stringify({
          error: `Insufficient ${coin} balance. Available: $${availableCoinBalance.toFixed(
            2
          )}`,
        }),
        {
          status: 400,
        }
      );
    }

    // Add withdrawal request to the user's withdraw array with planIndex
    user.withdraw.push({
      amount,
      status: "pending",
      method: coin,
      date: Date.now(),
      wallet,
      note,
      planIndex: planIndex, // Save plan index for deduction during approval
    });

    // Log the transaction
    user.transaction.push({
      text: `Withdrawal of ${amount}`,
      type: "withdrawal",
      date: Date.now(),
      status: "pending",
    });

    // Notify the admin about the withdrawal request
    const masterAdmin = await User.findOne({
      role: "admin",
    });
    if (masterAdmin) {
      masterAdmin.notifications.push({
        text: `${user.email} made a withdrawal request of $${amount} via ${coin}`,
        type: "withdrawal",
        date: Date.now(),
        index: user.withdraw.length - 1,
        userid: user._id,
        id: generateRandomString(),
        amount,
      });
      await masterAdmin.save();
    }
    await user.save();
    // Prepare and send the email notifications
    const userEmailContent = {
      url: `Hello ${user.username}

      Your withdrawal request of ${amount} USD via ${coin} has been submitted successfully.

      Details of your Withdrawal:
      
      Amount: ${amount} USD
      Note: ${
        note || "No additional note provided"
      }
      `,
      html: `
       <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Withdrawal Confirmation</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
          .banner {
        text-align: center;
        background-color: #f9fafb;
        padding: 20px;
      }
      .banner img {
        max-width: 100%;
        max-height: 200px;
      }
      .header {
        text-align: center;
        padding: 10px 0;
        background-color: #1daad9;
        color: #ffffff;
        border-radius: 8px 8px 0 0;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .content {
        margin: 20px 0;
      }
      .content p {
        font-size: 16px;
        color: #333333;
        line-height: 1.6;
      }
      .footer {
        text-align: center;
        padding: 15px;
        color: #ffffff;
        background-color: #1daad9;
        font-size: 14px;
        border-radius: 0 0 8px 8px;
      }
      .footer a {
        color: #ffffff;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h1>Withdrawal Confirmation</h1>
      </div>
      <div class="banner">
        <img src="https://goldgroveco.com/email-banner.jpg" alt="Banner Image" />
      </div>
      <div class="content">
        <p>Hello ${user.username},</p>
        <p>
          We are pleased to inform you that your withdrawal request of <strong>${amount} USD</strong> via <strong>${coin}</strong> has been submitted successfully.
        </p>
        <p>
          <strong>Withdrawal Details:</strong><br />
          Amount: ${amount} USD<br />
          Note: ${
            note || "No additional note provided"
          }
        </p>
        <p>
          If you have any questions or need further assistance, please feel free to contact our support team.
        </p>
        <p>Thank you for choosing GoldGreveco!</p>
      </div>
      <div class="footer">
        &copy; 2024 GoldGreveco. All rights reserved. |
        <a href="https://www.goldgroveco.com/">Visit our website</a>
      </div>
    </div>
  </body>
</html>
      `,
    };
    // Send email notification (don't fail if email fails)
    try {
      await sendEmail(
        user.email,
        "Withdrawal Request",
        userEmailContent.url,
        userEmailContent.html
      );
    } catch (emailError) {
      console.error(
        "Failed to send withdrawal request email:",
        emailError.message
      );
      // Continue execution even if email fails
    }

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
    const isadmin = await User.findById(
      params.id
    );

    if (isadmin.role !== "admin") {
      return new Response(
        JSON.stringify({
          error: "You are not an admin!",
        }),
        {
          status: 401,
        }
      );
    }
    const { index, amount, userid, id } =
      await req.json();

    console.log(
      "data:",
      index,
      amount,
      userid,
      id
    );

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
      user.withdraw[index]?.status ===
        "approved" ||
      user.withdraw[index]?.status === "declined"
    ) {
      return new Response(
        JSON.stringify({
          error: `Request already ${user.withdraw[index].status}`,
        }),
        { status: 400 }
      );
    }

    // Approve the withdraw
    user.withdraw[index].status = "approved";
    user.transaction.push({
      text: `Withdrawal of $${amount} approved`,
      type: "withdrawal",
      date: Date.now(),
      status: "approved",
    });

    // Get the planIndex from the withdrawal request
    const planIndex =
      user.withdraw[index].planIndex;

    // Deduct from the selected plan if planIndex exists
    if (
      planIndex !== undefined &&
      planIndex !== null
    ) {
      // Check if the plan still exists
      if (
        !user.activeDeposit ||
        !user.activeDeposit[planIndex]
      ) {
        return new Response(
          JSON.stringify({
            error:
              "Selected plan no longer exists",
          }),
          {
            status: 404,
          }
        );
      }

      // Check if the plan has enough balance
      if (
        user.activeDeposit[planIndex].amount <
        amount
      ) {
        return new Response(
          JSON.stringify({
            error:
              "Insufficient balance in selected plan",
          }),
          {
            status: 400,
          }
        );
      }

      // Deduct the amount from the selected plan
      user.activeDeposit[planIndex].amount -=
        amount;
    }

    // Deduct from user's balance
    user.balance = Math.max(
      0,
      Number(user.balance) - Number(amount)
    );
    user.totalWithdraw =
      (user.totalWithdraw || 0) + Number(amount);

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
      url: `Hello ${user.username},\n\nYour withdrawal request of ${amount} USD has been approved.\n\nDetails of your Withdrawal:\nAmount: ${amount} USD\nWallet: ${user.withdraw[index].wallet}\n\nThank you for choosing GoldGroveco!\n`,
      html: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Withdrawal Approved - GoldGroveco</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap" rel="stylesheet" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: 'Rubik', Arial, sans-serif;
        background-color: #f3f4f6;
        margin: 0;
        padding: 0;
        line-height: 1.6;
      }
      .email-wrapper {
        width: 100%;
        background-color: #f3f4f6;
        padding: 40px 20px;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        overflow: hidden;
      }
      .header {
        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
        padding: 40px 30px;
        text-align: center;
      }
      .logo {
        font-size: 28px;
        font-weight: 800;
        color: #ffffff;
        margin-bottom: 10px;
        letter-spacing: -0.5px;
      }
      .header-subtitle {
        color: #ffffff;
        font-size: 16px;
        font-weight: 400;
        opacity: 0.95;
      }
      .content {
        padding: 40px 30px;
      }
      .greeting {
        font-size: 20px;
        font-weight: 600;
        color: #111827;
        margin-bottom: 20px;
      }
      .message {
        font-size: 16px;
        color: #4b5563;
        margin-bottom: 30px;
        line-height: 1.7;
      }
      .success-badge {
        display: inline-flex;
        align-items: center;
        background-color: #d1fae5;
        color: #065f46;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 25px;
      }
      .success-icon {
        width: 18px;
        height: 18px;
        margin-right: 8px;
      }
      .transaction-card {
        background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
        border-left: 4px solid #22c55e;
        border-radius: 8px;
        padding: 25px;
        margin: 25px 0;
      }
      .transaction-title {
        font-size: 14px;
        font-weight: 700;
        color: #22c55e;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 15px;
      }
      .transaction-row {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid #e5e7eb;
      }
      .transaction-row:last-child {
        border-bottom: none;
      }
      .transaction-label {
        font-size: 14px;
        color: #6b7280;
        font-weight: 500;
      }
      .transaction-value {
        font-size: 14px;
        color: #111827;
        font-weight: 600;
        text-align: right;
        max-width: 60%;
        word-break: break-all;
      }
      .amount-highlight {
        font-size: 24px;
        color: #22c55e;
        font-weight: 700;
      }
      .info-box {
        background-color: #fef3c7;
        border-left: 4px solid #f59e0b;
        padding: 15px 20px;
        border-radius: 6px;
        margin: 20px 0;
      }
      .info-box p {
        font-size: 14px;
        color: #92400e;
        margin: 0;
      }
      .cta-section {
        text-align: center;
        margin: 30px 0;
      }
      .cta-button {
        display: inline-block;
        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
        color: #ffffff;
        text-decoration: none;
        padding: 14px 32px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 16px;
        box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
        transition: transform 0.2s;
      }
      .cta-button:hover {
        transform: translateY(-2px);
      }
      .footer {
        background-color: #111827;
        padding: 30px;
        text-align: center;
      }
      .footer-content {
        color: #9ca3af;
        font-size: 14px;
        margin-bottom: 15px;
      }
      .footer-links {
        margin: 20px 0;
      }
      .footer-link {
        color: #22c55e;
        text-decoration: none;
        margin: 0 12px;
        font-size: 13px;
        font-weight: 500;
      }
      .footer-link:hover {
        text-decoration: underline;
      }
      .social-icons {
        margin: 20px 0;
      }
      .social-icon {
        display: inline-block;
        width: 32px;
        height: 32px;
        margin: 0 8px;
        background-color: #374151;
        border-radius: 50%;
        line-height: 32px;
        color: #ffffff;
        text-decoration: none;
      }
      .copyright {
        color: #6b7280;
        font-size: 12px;
        margin-top: 20px;
      }
      .divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
        margin: 25px 0;
      }
      @media only screen and (max-width: 600px) {
        .email-wrapper {
          padding: 20px 10px;
        }
        .content {
          padding: 30px 20px;
        }
        .header {
          padding: 30px 20px;
        }
        .transaction-card {
          padding: 20px;
        }
        .amount-highlight {
          font-size: 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="email-container">
        <!-- Header Section -->
        <div class="header">
          <div class="logo">GoldGroveco.</div>
          <div class="header-subtitle">Expanding Opportunities in Investment</div>
        </div>

        <!-- Content Section -->
        <div class="content">
          <div class="greeting">Hello ${
            user.username
          },</div>
          
          <div class="success-badge">
            <svg class="success-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            Withdrawal Approved
          </div>

          <p class="message">
            Great news! Your withdrawal request has been successfully processed and approved. 
            The funds have been sent to your designated wallet address.
          </p>

          <!-- Transaction Details Card -->
          <div class="transaction-card">
            <div class="transaction-title">Withdrawal Details</div>
            
            <div class="transaction-row">
              <span class="transaction-label">Amount</span>
              <span class="transaction-value amount-highlight">$${amount} USD</span>
            </div>
            
            <div class="transaction-row">
              <span class="transaction-label">Wallet Address</span>
              <span class="transaction-value">${
                user.withdraw[index].wallet
              }</span>
            </div>
            
            <div class="transaction-row">
              <span class="transaction-label">Transaction Fee</span>
              <span class="transaction-value">$0.00 USD</span>
            </div>
            
            <div class="transaction-row">
              <span class="transaction-label">Status</span>
              <span class="transaction-value" style="color: #22c55e;">Completed</span>
            </div>
          </div>

          <div class="info-box">
            <p><strong>Note:</strong> Please allow up to 24-48 hours for the funds to reflect in your wallet, depending on network congestion.</p>
          </div>

          <div class="divider"></div>

          <p class="message" style="margin-bottom: 15px;">
            Thank you for trusting GoldGroveco with your investments. We're committed to providing you with secure and reliable financial services.
          </p>

          <!-- Call to Action -->
          <div class="cta-section">
            <a href="${
              process.env.NEXT_PUBLIC_BASE_URL ||
              "https://goldgroveco.com"
            }/dashboard" class="cta-button">
              View Dashboard
            </a>
          </div>
        </div>

        <!-- Footer Section -->
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

    // Send email notification (don't fail if email fails)
    try {
      await sendEmail(
        user.email,
        "Withdrawal Approved",
        userEmailContent.url,
        userEmailContent.html
      );
    } catch (emailError) {
      console.error(
        "Failed to send withdrawal approval email:",
        emailError.message
      );
      // Continue execution even if email fails
    }

    // Save the user's updated data
    await user.save();

    return new Response(JSON.stringify(user), {
      status: 200,
    });
  } catch (error) {
    console.error(
      "=== WITHDRAWAL APPROVAL ERROR ==="
    );
    console.error(
      "Error message:",
      error.message
    );
    console.error("Error stack:", error.stack);
    console.error("Full error object:", error);
    console.error(
      "================================"
    );

    return new Response(
      JSON.stringify({
        error: "Failed to approve withdrawal",
        details: error.message,
      }),
      {
        status: 500,
      }
    );
  }
};
