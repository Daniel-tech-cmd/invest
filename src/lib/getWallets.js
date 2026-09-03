import { cache } from "react";
import { auth } from "../auth";
import { connectToDB } from "./db";
import Wallet from "../models/Wallet";

function toPlain(doc) {
  return { id: doc._id, label: doc.label, assetId: doc.assetId, address: doc.address, network: doc.network, icon: doc.icon || null };
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
