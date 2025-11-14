import User from "../../../../../models/user";
import Token from "../../../../../models/token";
import crypto from "crypto";
import { connectToDB } from "@/app/utils/database";
import sendEmail from "@/app/utils/sendEmail";
import jwt from "jsonwebtoken";
export const maxDuration = 60;

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "365d" });
};

export const GET = async (request, { params }) => {
  const { id, token } = params; // Extract id and token from params

  await connectToDB(); // Connect to your database

  try {
    const user = await User.findById(id);
    // if (!user) {
    //   return new Response(JSON.stringify({ error: "Invalid link" }), {
    //     status: 404,
    //   });
    // }

    const userToken = await Token.findOne({ userId: id });
    // if (!userToken || userToken.token !== token) {
    //   return new Response(JSON.stringify({ error: "Invalid link" }), {
    //     status: 404,
    //   });
    // }

    // // Mark user as verified
    // user.verified = true;
    // if (user.referredby) {
    //   // Find the referring user by username
    //   const referal = await User.findOne({ username: user.referredby });

    //   // Find the referral object where name matches user.username
    //   const obj = referal.referals.find((item) => item.name === user.username);

    //   // If the referral object is found, update its verified property to true
    //   if (obj) {
    //     obj.verified = true;
    //   }

    //   // Save the changes to the referal document
    //   await referal.save();
    // }

    // await user.save(); // Save the updated user

    // // Remove the token after verification
    // await Token.findByIdAndDelete(userToken._id);

    // // Create a new token for the user
    // const newToken = createToken(user._id);

    // Prepare email content
    const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New User Registration - GoldGroveco</title>
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
      .title { font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 20px; }
      .message { font-size: 16px; color: #4b5563; margin-bottom: 30px; line-height: 1.7; }
      .new-user-badge { display: inline-flex; align-items: center; background-color: #dbeafe; color: #1e40af; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-bottom: 25px; }
      .user-icon { width: 18px; height: 18px; margin-right: 8px; }
      .user-info-card { background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); border-left: 4px solid #22c55e; border-radius: 8px; padding: 25px; margin: 25px 0; text-align: left; }
      .info-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
      .info-row:last-child { border-bottom: none; }
      .info-label { font-size: 14px; color: #6b7280; font-weight: 500; }
      .info-value { font-size: 14px; color: #111827; font-weight: 600; text-align: right; word-break: break-all; }
      .footer { background-color: #111827; padding: 30px; text-align: center; }
      .footer-content { color: #9ca3af; font-size: 14px; }
      .copyright { color: #6b7280; font-size: 12px; margin-top: 15px; }
      @media only screen and (max-width: 600px) {
        .email-wrapper { padding: 20px 10px; }
        .content { padding: 30px 20px; }
        .header { padding: 30px 20px; }
        .user-info-card { padding: 20px; }
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
          <div class="title">New User Registration</div>
          <div class="new-user-badge">
            <svg class="user-icon" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
            </svg>
            New Sign Up
          </div>
          <p class="message">
            A new user has registered on the platform. Here are the details:
          </p>
          <div class="user-info-card">
            <div class="info-row">
              <span class="info-label">Username</span>
              <span class="info-value">${user.username}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email</span>
              <span class="info-value">${user.email}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Registration Date</span>
              <span class="info-value">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
        <div class="footer">
          <div class="footer-content">
            <strong style="color: #ffffff;">GoldGroveco Admin Panel</strong>
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
    const masterAdmin = await User.findOne({ role: "admin" });
    // Send email notification
    await sendEmail(
      masterAdmin.email,
      "Sign Up",
      `${user.email} just registered`,
      html
    );

    // Respond with the new user token
    return new Response(JSON.stringify({ _id: user._id, token: newToken }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
