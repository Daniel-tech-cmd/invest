import User from "../../models/user";
import Token from "@/app/models/token";
import { connectToDB } from "@/app/utils/database";

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
// import Passwordrec from require("../models/passwordrec");
// import Token from require("../models/token");
import crypto from "crypto";
import sendEmail from "../../utils/sendEmail";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, {
    expiresIn: "365d",
  });
};
const generateRandomString = () => {
  const characters =
    "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const randomBuffer = crypto.getRandomValues(
    new Uint8Array(6),
  );

  const generatedString = Array.from(randomBuffer)
    .map(
      (byte) =>
        characters[byte % characters.length],
    )
    .join("");

  return generatedString.substring(0, 6);
};
export const POST = async (request) => {
  try {
    const {
      email,
      password,
      username,
      confirmPassword,
      referralCode,
      role,
      gender,
    } = await request.json();

    // Validate required fields
    if (
      !email ||
      !password ||
      !username ||
      !gender
    ) {
      return new Response(
        JSON.stringify({
          error: "All fields are required!",
        }),
        { status: 400 },
      );
    }

    if (username.length < 4) {
      return new Response(
        JSON.stringify({
          error:
            "Username should be more than 4 letters!",
        }),
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return new Response(
        JSON.stringify({
          error: "Password mis-match!",
        }),
        { status: 400 },
      );
    }

    await connectToDB();

    // Create user
    let user;
    try {
      const lowercaseEmail = email.toLowerCase();
      const lowercaseGender =
        gender.toLowerCase();
      user = await User.signup(
        lowercaseEmail,
        password,
        username,
        role,
        lowercaseGender,
        referralCode || null,
      );
    } catch (error) {
      console.log("Signup error:", error);
      return new Response(
        JSON.stringify({
          error: error.message,
        }),
        { status: 400 },
      );
    }

    // Handle referral if provided
    if (
      referralCode &&
      referralCode.trim() !== ""
    ) {
      try {
        const referrer = await User.findOne({
          username: referralCode.trim(),
        });

        if (referrer) {
          // Use $push operator for proper array update
          await User.findByIdAndUpdate(
            referrer._id,
            {
              $push: {
                referals: {
                  name: username,
                  id: generateRandomString(),
                  verified: false,
                },
              },
            },
            { new: true },
          );

          // Send email notification to the referrer
          try {
            const referralEmailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 30px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .logo {
      font-weight: 800;
      font-size: 24px;
      background: linear-gradient(to right, #22c55e, #000000);
      -webkit-background-clip: text;
      color: transparent;
      text-align: center;
      margin-bottom: 20px;
    }
    h1 {
      color: #333;
      text-align: center;
      font-size: 22px;
    }
    p {
      color: #666;
      margin-bottom: 15px;
      line-height: 1.6;
    }
    .highlight {
      background-color: #ecfdf5;
      border: 1px solid #10b981;
      border-radius: 8px;
      padding: 15px;
      margin: 20px 0;
      text-align: center;
    }
    .highlight strong {
      color: #047857;
      font-size: 18px;
    }
    .button {
      display: block;
      width: 200px;
      margin: 25px auto;
      padding: 14px 28px;
      color: #fff !important;
      text-decoration: none;
      background-color: #2563eb;
      border-radius: 8px;
      text-align: center;
      font-weight: 600;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      text-align: center;
      color: #999;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">GoldGroveco.</div>
    <h1>New Referral Signup!</h1>
    <p>Hello ${referrer.username},</p>
    <p>Great news! Someone just signed up using your referral link.</p>
    <div class="highlight">
      <strong>${username}</strong>
      <p style="margin: 5px 0 0 0; font-size: 14px;">has joined using your referral</p>
    </div>
    <p>Once they make their first deposit and it gets approved, you'll receive your referral bonus!</p>
    <p>Keep sharing your referral link to earn more rewards.</p>
    <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://goldgroveco.com"}/dashboard" class="button">Go to Dashboard</a>
    <div class="footer">
      <p>Thank you for being a valued member of Goldgroveco Investors</p>
    </div>
  </div>
</body>
</html>`;

            await sendEmail(
              referrer.email,
              "New Referral Signup - Goldgroveco",
              `${username} just signed up using your referral link!`,
              referralEmailHtml,
            );
          } catch (emailError) {
            // Log email error but don't fail the signup
            console.log(
              "Referral email error:",
              emailError,
            );
          }
        } else {
          console.log(
            "Referrer not found:",
            referralCode,
          );
        }
      } catch (referralError) {
        // Log referral error but don't fail the signup
        console.log(
          "Referral processing error:",
          referralError,
        );
      }
    }

    const token = createToken(user._id);
    user.token = token;

    return new Response(JSON.stringify(user), {
      status: 200,
    });
  } catch (error) {
    console.log("Signup route error:", error);
    return new Response(
      JSON.stringify({
        error:
          error.message ||
          "An error occurred during signup",
      }),
      { status: 500 },
    );
  }
};
