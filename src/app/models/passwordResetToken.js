import { Schema, model, models } from "mongoose";

const passwordResetTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () =>
        new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiry
    },
  },
  { timestamps: true },
);

// Index for auto-deletion of expired tokens
passwordResetTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 },
);

const PasswordResetToken =
  models.PasswordResetToken ||
  model(
    "PasswordResetToken",
    passwordResetTokenSchema,
  );

export default PasswordResetToken;
