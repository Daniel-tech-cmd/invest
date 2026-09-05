import { cache } from "react";
import { auth } from "../auth";
import { connectToDB } from "./db";
import User from "../models/User";

const isToday = (date) => {
  const d = new Date(date);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
};

// Shapes a lean DB user document into exactly what the dashboard pages
// already expect from src/app/lib/mockUser.js — same field names, so pages
// go from `const user = mockUser` to `const user = await getCurrentUser()`
// without touching the components themselves.
function normalizeUser(doc, earnHistory) {
  const withId = (subdoc) => ({ ...subdoc, id: subdoc._id });

  const pendingWithdrawals = (doc.withdraw || []).filter((w) => w.status === "pending").reduce((sum, w) => sum + (w.amount || 0), 0);

  const activeDeposit = (doc.activeDeposit || []).map((d) => {
    const profitToday = earnHistory.filter((e) => e.plan === d.plan && isToday(e.date)).reduce((sum, e) => sum + (e.amount || 0), 0);
    return { ...withId(d), profitToday };
  });

  // Falls back to the old app's real field name (`name` instead of
  // `username`) for referral entries created before this account was
  // migrated onto the new schema — same tolerant-read pattern as
  // getWallets.js's toPlain(). `.lean()` returns the raw document regardless
  // of what's declared in our schema, so the old field is still readable.
  const referals = (doc.referals || []).map((r) => ({ name: r.username || r.name, id: r._id, verified: r.verified }));

  return {
    ...doc,
    id: doc._id,
    fullName: doc.fullName || doc.username,
    avatar: doc.image || null,
    referralCode: doc.username,
    pendingWithdrawals,
    activeDeposit,
    deposit: (doc.deposit || []).map(withId),
    withdraw: (doc.withdraw || []).map(withId),
    earnHistory: earnHistory.map(withId),
    referals,
    activereferrals: referals.filter((r) => r.verified).length,
  };
}

// Cached per-request (React's cache()) so calling this from both the
// dashboard layout and each individual page doesn't hit the DB twice.
export const getCurrentUser = cache(async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  await connectToDB();
  const doc = await User.findById(session.user.id).lean();
  if (!doc) return null;

  const plain = JSON.parse(JSON.stringify(doc));
  const normalized = normalizeUser(plain, plain.earnHistory || []);
  normalized.impersonatedBy = session.user.impersonatedBy || null;
  return normalized;
});
