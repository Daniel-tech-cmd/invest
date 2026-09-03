import crypto from "crypto";
import bcrypt from "bcryptjs";
import { connectToDB } from "../../../lib/db";
import User from "../../../models/User";
import PasswordResetToken from "../../../models/PasswordResetToken";

export async function POST(req) {
  try {
    const { token, userId, password } = await req.json();

    if (!token || !userId || !password) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }
    if (password.length < 6) {
      return Response.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
    }

    await connectToDB();

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const resetToken = await PasswordResetToken.findOne({ userId, token: hashedToken });

    if (!resetToken) {
      return Response.json({ error: "Invalid or expired reset link. Please request a new one." }, { status: 400 });
    }
    if (resetToken.expiresAt < new Date()) {
      await PasswordResetToken.deleteOne({ _id: resetToken._id });
      return Response.json({ error: "Reset link has expired. Please request a new one." }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });
    await PasswordResetToken.deleteOne({ _id: resetToken._id });

    return Response.json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "An error occurred. Please try again later." }, { status: 500 });
  }
}
