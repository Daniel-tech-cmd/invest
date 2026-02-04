import User from "../../models/user";
import PasswordResetToken from "../../models/passwordResetToken";
import { connectToDB } from "@/app/utils/database";
import crypto from "crypto";
import sendEmail from "../../utils/sendEmail";

export const POST = async (request) => {
  const { email } = await request.json();

  if (!email) {
    return new Response(
      JSON.stringify({
        error: "Email is required",
      }),
      { status: 400 },
    );
  }

  try {
    await connectToDB();

    const lowercaseEmail = email.toLowerCase();
    const user = await User.findOne({
      email: lowercaseEmail,
    });

    if (!user) {
      // Return success even if user doesn't exist (security best practice)
      return new Response(
        JSON.stringify({
          message:
            "If an account with that email exists, a password reset link has been sent.",
        }),
        { status: 200 },
      );
    }

    // Delete any existing reset tokens for this user
    await PasswordResetToken.deleteMany({
      userId: user._id,
    });

    // Generate a secure random token
    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save the hashed token to database
    await PasswordResetToken.create({
      userId: user._id,
      token: hashedToken,
      expiresAt: new Date(
        Date.now() + 60 * 60 * 1000,
      ), // 1 hour
    });

    // Create reset URL (use the unhashed token in the URL)
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/reset-password?token=${resetToken}&id=${user._id}`;

    const html = `<!DOCTYPE html>
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
    .button:hover {
      background-color: #1d4ed8;
    }
    .warning {
      background-color: #fef3c7;
      border: 1px solid #f59e0b;
      border-radius: 6px;
      padding: 12px;
      margin-top: 20px;
      font-size: 13px;
      color: #92400e;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      text-align: center;
      color: #999;
      font-size: 12px;
    }
    .link-text {
      word-break: break-all;
      color: #2563eb;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">GoldGroveco.</div>
    <h1>Password Reset Request</h1>
    <p>Hello,</p>
    <p>We received a request to reset your password for your Goldgroveco account. Click the button below to reset your password:</p>
    <a href="${resetUrl}" class="button">Reset Password</a>
    <p>If the button doesn't work, copy and paste this link into your browser:</p>
    <p class="link-text">${resetUrl}</p>
    <div class="warning">
      <strong>⚠️ Important:</strong> This link will expire in <strong>1 hour</strong>. If you didn't request a password reset, please ignore this email or contact support if you have concerns.
    </div>
    <div class="footer">
      <p>This email was sent by Goldgroveco Investors</p>
      <p>Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>`;

    await sendEmail(
      user.email,
      "Password Reset Request - Goldgroveco",
      resetUrl,
      html,
    );

    return new Response(
      JSON.stringify({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Forgot password error:",
      error,
    );
    return new Response(
      JSON.stringify({
        error:
          "An error occurred. Please try again later.",
      }),
      { status: 500 },
    );
  }
};
