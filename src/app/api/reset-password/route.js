import User from "../../models/user";
import PasswordResetToken from "../../models/passwordResetToken";
import { connectToDB } from "@/app/utils/database";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export const POST = async (request) => {
  const { token, userId, password } =
    await request.json();

  if (!token || !userId || !password) {
    return new Response(
      JSON.stringify({
        error: "All fields are required",
      }),
      { status: 400 },
    );
  }

  if (password.length < 6) {
    return new Response(
      JSON.stringify({
        error:
          "Password must be at least 6 characters long",
      }),
      { status: 400 },
    );
  }

  try {
    await connectToDB();

    // Hash the provided token to compare with stored hash
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find the reset token
    const resetToken =
      await PasswordResetToken.findOne({
        userId: userId,
        token: hashedToken,
      });

    if (!resetToken) {
      return new Response(
        JSON.stringify({
          error:
            "Invalid or expired reset link. Please request a new one.",
        }),
        { status: 400 },
      );
    }

    // Check if token has expired
    if (resetToken.expiresAt < new Date()) {
      await PasswordResetToken.deleteOne({
        _id: resetToken._id,
      });
      return new Response(
        JSON.stringify({
          error:
            "Reset link has expired. Please request a new one.",
        }),
        { status: 400 },
      );
    }

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return new Response(
        JSON.stringify({
          error: "User not found",
        }),
        { status: 404 },
      );
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      password,
      salt,
    );

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    // Delete the used reset token
    await PasswordResetToken.deleteOne({
      _id: resetToken._id,
    });

    return new Response(
      JSON.stringify({
        message:
          "Password has been reset successfully",
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return new Response(
      JSON.stringify({
        error:
          "An error occurred. Please try again later.",
      }),
      { status: 500 },
    );
  }
};
