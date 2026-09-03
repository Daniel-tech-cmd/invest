import { Schema, model, models } from "mongoose";

const PasswordResetTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // SHA-256 hash of the token — the raw token only ever exists in the
    // email link, never stored, so a DB leak alone can't be used to reset
    // anyone's password.
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true, default: () => new Date(Date.now() + 60 * 60 * 1000) },
  },
  { timestamps: true },
);

// Mongo automatically deletes the document once expiresAt passes.
PasswordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PasswordResetToken = models.PasswordResetToken || model("PasswordResetToken", PasswordResetTokenSchema);

export default PasswordResetToken;
