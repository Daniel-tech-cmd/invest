import { Schema, model, models } from "mongoose";

// Admin-defined plans that sit alongside the 5 standard PLANS (lib/plans.js).
// A "private" plan is assigned to exactly one user and REPLACES the standard
// catalog in their Deposit/Reinvest pickers; "public" adds it to everyone's
// catalog instead of replacing anything. No old-app equivalent — invented
// during this rebuild's dashboard phase.
const CustomPlanSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    rate: { type: Number, required: true, min: 0 },
    days: { type: Number, required: true, min: 1 },
    min: { type: Number, required: true, min: 0 },
    visibility: { type: String, enum: ["private", "public"], default: "private" },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true },
);

const CustomPlan = models.CustomPlan || model("CustomPlan", CustomPlanSchema);

export default CustomPlan;
