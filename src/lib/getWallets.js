import { cache } from "react";
import { auth } from "../auth";
import { connectToDB } from "./db";
import Wallet from "../models/Wallet";

// Tolerant of the old app's real wallet documents (same shared production
// DB now, different field names — old app used `name` as the ticker and
// `ico` for the icon, no separate `label`). `.lean()` returns the raw
// document regardless of what's declared in our schema, so old-shaped
// fields are still readable here even though Mongoose doesn't know about
// them. Old app's own separate `id` string field is deliberately not used
// for matching — `name` is what its real deposit flow actually matched on.
function toPlain(doc) {
  const assetId = doc.assetId || doc.name || "";
  return {
    id: doc._id,
    label: doc.label || doc.name || assetId,
    assetId,
    address: doc.address,
    network: doc.network,
    icon: doc.icon || (doc.ico?.url ? { url: doc.ico.url, publicId: doc.ico.public_id } : null),
  };
}

// Any signed-in user can read the wallet list — it's what the investor
// Deposit page shows as payment destinations, not admin-only data (the
// addresses are meant to be given out to anyone depositing).
export const getAllWallets = cache(async function getAllWallets() {
  const session = await auth();
  if (!session?.user?.id) return [];

  await connectToDB();
  const wallets = await Wallet.find({}).sort({ createdAt: 1 }).lean();
  return JSON.parse(JSON.stringify(wallets)).map(toPlain);
});

export const getWalletById = cache(async function getWalletById(id) {
  const session = await auth();
  if (!session?.user?.id) return null;

  await connectToDB();
  let doc;
  try {
    doc = await Wallet.findById(id).lean();
  } catch {
    return null;
  }
  if (!doc) return null;
  return toPlain(JSON.parse(JSON.stringify(doc)));
});
