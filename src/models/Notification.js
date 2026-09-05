import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    url: { type: String, default: "/dashboard" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
