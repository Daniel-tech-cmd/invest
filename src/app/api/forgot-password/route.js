import crypto from "crypto";
import { connectToDB } from "../../../lib/db";
import User from "../../../models/User";
import PasswordResetToken from "../../../models/PasswordResetToken";
import sendEmail from "../../../lib/sendEmail";
import { renderNotificationEmail } from "../../../lib/emailTemplates";

const GENERIC_MESSAGE = "If an account with that email exists, a password reset link has been sent.";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    await connectToDB();
    const user = await User.findOne({ email: String(email).toLowerCase().trim() });

    // Same response whether or not the account exists — never reveal which
    // emails are registered.
    if (!user) {
      return Response.json({ message: GENERIC_MESSAGE });
    }

    await PasswordResetToken.deleteMany({ userId: user._id });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    await PasswordResetToken.create({
      userId: user._id,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://goldgroveco.com"}/reset-password?token=${resetToken}&id=${user._id}`;

    sendEmail(
      user.email,
      "Password Reset Request",
      `Reset your GoldGroveco password: ${resetUrl}`,
      renderNotificationEmail({
        heading: "Password Reset Request",
        greeting: user.username,
        message: "We received a request to reset your password. Click below to choose a new one — this link expires in 1 hour.",
        ctaText: "Reset password",
        ctaUrl: resetUrl,
        noteText: "If you didn't request this, you can safely ignore this email — your password won't change.",
      }),
    ).catch((err) => console.error("Password reset email failed:", err.message));

    return Response.json({ message: GENERIC_MESSAGE });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "An error occurred. Please try again later." }, { status: 500 });
  }
}
