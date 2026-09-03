import { Schema, model, models } from "mongoose";

// Platform-owned receiving addresses shown on the investor Deposit page —
// the live source, not just admin config. Field names match WalletForm.jsx
// (already built): label/assetId/address/network/icon, no old app's
// redundant separate `name`+`id`+`image` fields (image was never even
// rendered anywhere in the old app's deposit flow).
const WalletSchema = new Schema(
  {
    label: { type: String, required: true }, // display name, e.g. "Bitcoin"
    assetId: { type: String, required: true, unique: true, uppercase: true, trim: true }, // ticker, e.g. "BTC"
    address: { type: String, required: true },
    network: { type: String },
    icon: { url: String, publicId: String },
  },
  { timestamps: true },
);

const Wallet = models.Wallet || model("Wallet", WalletSchema);

export default Wallet;
