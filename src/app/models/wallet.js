import { Schema, model, models } from "mongoose";
const walletSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    id: {
      type: String,
      required: true,
    },

    address: {
      type: String,
    },
    image: {
      url: String,
      public_id: String,
    },
    ico: {
      url: String,
      public_id: String,
    },
  },
  { timestamps: true }
);

const Wallet = models.Wallet || model("Wallet", walletSchema);

export default Wallet;
