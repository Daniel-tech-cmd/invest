import User from "../../../../models/user";
import { connectToDB } from "@/app/utils/database";
import sendEmail from "@/app/utils/sendEmail";

export const PATCH = async (req, { params }) => {
  await connectToDB();

  try {
    const { index, amount, userid, id } = await req.json();

    // Find the user by their ID
    const user = await User.findById(userid);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // Check if the withdrawal has already been processed
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

    // Set withdraw status to "declined"
    user.withdraw[index].status = "declined";
    user.transaction.push({
      text: `Withdrawal of $${amount} declined`,
      type: "withdrawal",
      date: Date.now(),
      status: "declined",
    });

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
      url: `Hello ${user.username},\n\nYour withdrawal request of ${amount} USD was declined.\n\nDetails of your Withdrawal:\nAmount: ${amount} USD\nCharge: 0.0000 USD\n`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Withdrawal Declined</title>
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
                background-color: #d9534f;
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
                background-color: #d9534f;
                font-size: 14px;
                border-radius: 0 0 8px 8px;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1>Withdrawal Declined</h1>
              </div>
              <div class="content">
                <p>Hello ${user.username},</p>
                <p>Your withdrawal request of <strong>${amount} USD</strong> was declined.</p>
                <p><strong>Withdrawal Details:</strong><br />
                  Amount: ${amount} USD<br />
                  Charge: 0.0000 USD
                </p>
                <p>Thank you for choosing GoldGreveco!</p>
              </div>
              <div class="footer">
                &copy; 2024 GoldGreveco. All rights reserved.
              </div>
            </div>
          </body>
        </html>
      `,
    };

    await sendEmail(
      user.email,
      "Withdrawal Declined",
      userEmailContent.url,
      userEmailContent.html
    );

    // Save the user's updated data
    await user.save();

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to decline withdrawal" }),
      {
        status: 500,
      }
    );
  }
};
