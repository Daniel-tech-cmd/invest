import User from "../../../models/user";
import { connectToDB } from "@/app/utils/database";
import sendEmail from "@/app/utils/sendEmail";

const generateRandomString = () => {
  const characters = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomBuffer = crypto.getRandomValues(new Uint8Array(6));

  const generatedString = Array.from(randomBuffer)
    .map((byte) => characters[byte % characters.length])
    .join("");

  return generatedString;
};

export const POST = async (req, { params }) => {
  await connectToDB();

  try {
    const { amount, coin, note, wallet } = await req.json();
    const userId = params.id;

    const user = await User.findById(userId);

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // Check if the user has enough balance
    if (user.balance < amount) {
      return new Response(JSON.stringify({ error: "Insufficient balance" }), {
        status: 400,
      });
    }

    // Deduct the amount from user's balance
    user.balance -= amount;

    // Add withdrawal request to the user's withdraw array
    user.withdraw.push({
      amount,
      status: "pending",
      method: coin,
      date: Date.now(),
      wallet,
      note,
    });

    // Log the transaction
    user.transaction.push({
      text: `Withdrawal of ${amount}`,
      type: "withdrawal",
      date: Date.now(),
      status: "pending",
    });

    // Notify the admin about the withdrawal request
    const masterAdmin = await User.findOne({ role: "admin" });
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

    // Prepare and send the email notifications
    const userEmailContent = {
      url: `Hello ${user.username}

      Your withdrawal request of ${amount} USD via ${coin} has been submitted successfully.

      Details of your Withdrawal:
      
      Amount: ${amount} USD
      Note: ${note || "No additional note provided"}
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
      <div class="content">
        <p>Hello ${user.username},</p>
        <p>
          We are pleased to inform you that your withdrawal request of <strong>${amount} USD</strong> via <strong>${coin}</strong> has been submitted successfully.
        </p>
        <p>
          <strong>Withdrawal Details:</strong><br />
          Amount: ${amount} USD<br />
          Note: ${note || "No additional note provided"}
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
    await sendEmail(
      user.email,
      "Withdrawal Request",
      userEmailContent.url,
      userEmailContent.html
    );

    await user.save();
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};

export const PATCH = async (req, { params }) => {
  await connectToDB();

  try {
    const isadmin = await User.findById(params.id);

    if (isadmin.role !== "admin") {
      return new Response(JSON.stringify({ error: "You are not an admin!" }), {
        status: 401,
      });
    }
    const { index, amount, userid, id } = await req.json();

    const user = await User.findById(userid);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    if (
      user.withdraw[index]?.status === "approved" ||
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

    // Update user's balance
    user.balance = Math.max(0, Number(user.balance) - Number(amount));
    user.totalWithdraw = (user.totalWithdraw || 0) + Number(amount);

    // Remove notification from admin
    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      admin.notifications = admin.notifications.filter(
        (notification) => notification.id !== id
      );
      await admin.save();
    }

    // Prepare and send email notification
    const userEmailContent = {
      url: `Hello ${user.username},\n\nYour withdrawal request of ${amount} USD has been approved.\n\nDetails of your Withdrawal:\nAmount: ${amount} USD\nCharge: 0.0000 USD\n`,
      html: `
        <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Payment Processed</title>
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
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
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
        padding: 15px;
        background-color: #1daad9;
        color: #ffffff;
        font-size: 18px;
        font-weight: bold;
      }
      .content {
        padding: 20px;
        font-size: 16px;
        color: #333333;
        line-height: 1.6;
      }
      .content strong {
        color: #1daad9;
      }
      .footer {
        text-align: center;
        padding: 15px;
        background-color: #1daad9;
        color: #ffffff;
        font-size: 14px;
      }
      .transaction-details {
        margin: 20px 0;
        padding: 15px;
        background-color: #f9fafb;
        border-radius: 8px;
        font-size: 14px;
        line-height: 1.5;
        color: #555555;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <!-- Banner Section -->
      <div class="banner">
        <img src="https://goldgroveco.com/email-banner.jpg" alt="Banner Image" />
      </div>

      <!-- Header Section -->
      <div class="header">
        Payment Processed
      </div>

      <!-- Content Section -->
      <div class="content">
        <p>Hello ${user.username},</p>
        <p>
          Your withdrawal has been successfully confirmed and sent to your
          Bitcoin wallet.
        </p>
        <div class="transaction-details">
          <p><strong>Withdrawal Details:</strong></p>
          <p>
            <strong>Amount:</strong> ${amount} USD<br />
            <strong>Account:</strong> ${user.withdraw[index].wallet}
          </p>
         
        </div>
        <p>Thank you for choosing ${"Goldgroveco"}!</p>
      </div>

      <!-- Footer Section -->
      <div class="footer">
        &copy; ${2024} ${"Goldgroveco"}. All rights reserved.
      </div>
    </div>
  </body>
</html>

      `,
    };

    await sendEmail(
      user.email,
      "Withdrawal Approved",
      userEmailContent.url,
      userEmailContent.html
    );

    // Save the user's updated data
    await user.save();

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error(error.message);
    return new Response(
      JSON.stringify({ error: "Failed to approve withdrawal" }),
      {
        status: 500,
      }
    );
  }
};
