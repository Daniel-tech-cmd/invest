import User from "../../../models/user";
import { connectToDB } from "@/app/utils/database";
import { cloudinary } from "../../../utils/cloudinary";
export const dynamic = "force-dynamic";
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
    const {
      amount,
      crypto: method,
      reciept: receiptData,
      plan,
    } = await req.json();
    const userId = params.id;

    const user = await User.findById(userId);

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    let receipt;
    if (receiptData) {
      try {
        const photo = await cloudinary.uploader.upload(receiptData, {
          folder: "images",
          width: "auto",
          crop: "fit",
        });
        if (photo) {
          receipt = {
            public_id: photo.public_id,
            url: photo.url,
          };
        }
      } catch (error) {
        console.error(error);
        return new Response(
          JSON.stringify({ error: "Could not upload image" }),
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

    const masterAdmin = await User.findOne({ role: "admin" });
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
      url: `Hello ${user.username}

      Your deposit request of ${amount} USD via ${method} has been submitted successfully.

      Details of your Deposit:
      
      Amount: ${amount} USD
      Charge: 0.0000 USD
      `,
      html: `
       <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Deposit Confirmation</title>
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
        <h1>Deposit Confirmation</h1>
      </div>
      <div class="banner">
        <img src="https://goldgroveco.com/email-banner.jpg" alt="Banner Image" />
      </div>
      <div class="content">
        <p>Hello ${user.username},</p>
        <p>
          We are pleased to inform you that your deposit request of <strong>${amount} USD</strong> via <strong>${method}</strong> has been submitted successfully.
        </p>
        <p>
          <strong>Deposit Details:</strong><br />
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
      "Deposit Request",
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
    const { index, amount, userid, id } = await req.json();

    const user = await User.findById(userid);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    if (
      user.deposit[index]?.status === "approved" ||
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
    user.balance = Number(user.balance) + Number(amount);
    user.totalDeposit = Number(user.totalDeposit) + Number(amount);

    // Ensure activeDeposit object exists
    if (!user.activeDeposit) {
      user.activeDeposit = { amount: 0, date: null };
    }

    // Update active deposit date for the first deposit
    if (
      user.activeDeposit.amount === 0 ||
      user.activeDeposit.amount == undefined
    ) {
      user.activeDeposit.date = Date.now();
    }

    // Check for referral and first approved deposit conditions
    if (
      user.referredby &&
      user.deposit.filter((dep) => dep.status === "approved").length === 1
    ) {
      console.log("here");
      const referringUser = await User.findOne({ username: user.referredby });

      if (referringUser) {
        const referralBonus = amount * 0.1;

        referringUser.referralBonus =
          (referringUser.referralBonus || 0) + referralBonus;
        referringUser.balance = (referringUser.balance || 0) + referralBonus;

        await referringUser.save();
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

      const existactivedepo = user.activeDeposit.find(
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
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

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
      url: `Hello ${user.username},\n\nYour deposit request of ${amount} USD has been approved.\n\nDetails of your Deposit:\nAmount: ${amount} USD\nCharge: 0.0000 USD\n`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Deposit Approval</title>
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
                <h1>Deposit Approved</h1>
              </div>
              <div class="banner">
        <img src="https://goldgroveco.com/email-banner.jpg" alt="Banner Image" />
      </div>
              <div class="content">
                <p>Hello ${user.username},</p>
                <p>Your deposit request of <strong>${amount} USD</strong> has been approved.</p>
                <p><strong>Deposit Details:</strong><br />
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
      "Deposit Approved",
      userEmailContent.url,
      userEmailContent.html
    );

    // Save the user's updated data
    await user.save();

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to approve deposit" }),
      {
        status: 500,
      }
    );
  }
};
