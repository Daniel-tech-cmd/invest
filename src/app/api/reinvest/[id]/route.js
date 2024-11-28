import User from "../../../models/user";
import { connectToDB } from "@/app/utils/database";
export const dynamic = "force-dynamic";
import sendEmail from "@/app/utils/sendEmail";

export const POST = async (req, { params }) => {
  await connectToDB();
  try {
    const { _id, amount } = await req.json();
    const userId = params.id;

    const user = await User.findById(userId);

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // Find the active deposit by _id
    const activeDeposit = user.activeDeposit.find(
      (deposit) => deposit._id.toString() === _id
    );

    if (!activeDeposit) {
      return new Response(JSON.stringify({ error: "Deposit not found" }), {
        status: 404,
      });
    }

    // Check if the current activeDeposit.amount + profit >= requested amount
    if (activeDeposit.amount + user.profit >= amount) {
      // Update active deposit fields
      activeDeposit.stopped = false;
      activeDeposit.date = Date.now();
      activeDeposit.amount = amount;

      // Push to user's deposit history
      user.deposit.push({
        amount,
        status: "approved",
        method: "reinvestment",
        date: Date.now(),
        index: user.deposit.length,
        plan: activeDeposit.plan,
      });

      // Push to user's transaction history
      user.transaction.push({
        text: `Reinvestment of ${amount}`,
        type: "reinvestment",
        date: Date.now(),
        status: "approved",
      });

      // Update total deposit and decrease profit by amount reinvested
      user.totalDeposit = Number(user.totalDeposit) + Number(amount);
      user.profit = Number(user.profit) - Number(amount);

      if (user.profit < 0) {
        user.profit = 0;
      }

      // Send confirmation email
      const userEmailContent = {
        url: `Hello ${user.username}
        
          Your reinvestment request of ${amount} USD into the selected plan has been submitted successfully.
        
          Details of your Reinvestment:
          
          Amount: ${amount} USD
          Charge: 0.0000 USD
          `,
        html: `
           <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Reinvestment Confirmation</title>
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
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1>Reinvestment Confirmation</h1>
              </div>
               <div class="banner">
        <img src="https://goldgroveco.com/email-banner.jpg" alt="Banner Image" />
      </div>
              <div class="content">
                <p>Hello ${user.username},</p>
                <p>
                  We are pleased to inform you that your reinvestment request of <strong>${amount} USD</strong> into the selected plan has been submitted successfully.
                </p>
                <p>
                  <strong>Reinvestment Details:</strong><br />
                  Amount: ${amount} USD<br />
                  Charge: 0.0000 USD
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
        "Re-investment Successful",
        userEmailContent.url,
        userEmailContent.html
      );

      await user.save();
      return new Response(JSON.stringify(user), { status: 200 });
    } else {
      return new Response(
        JSON.stringify({
          error:
            "Insufficient funds in deposit and profit for the requested amount.",
        }),
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
