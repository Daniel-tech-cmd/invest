import { Schema, model, models } from "mongoose";
const tokenSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    token: {
      type: String,
      required: true,
    },

    exp: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Token = models.Token || model("Token", tokenSchema);

export default Token;
