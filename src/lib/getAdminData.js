import { cache } from "react";
import { auth } from "../auth";
import { connectToDB } from "./db";
import User from "../models/User";

// Every admin data-fetcher re-checks the role itself rather than trusting
// that middleware already gated the route — the old app's /admin page had
// no check at all (a filename typo meant its real access-control file,
// proxy.js, never actually loaded as middleware), so this is deliberately
// defense-in-depth, not redundant.
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  if (session.user.role !== "admin" && session.user.role !== "master admin") return null;
  return session;
}

export const getAllUsersSummary = cache(async function getAllUsersSummary() {
  const session = await requireAdmin();
  if (!session) return null;

  await connectToDB();
  const users = await User.find(
    {},
    "username email role balance totalDeposit totalWithdraw suspended createdAt referredby accountId activeDeposit.stopped",
  ).lean();

  const plain = JSON.parse(JSON.stringify(users));
  return plain.map((u) => ({
    id: u._id,
    username: u.username,
    email: u.email,
    role: u.role,
    balance: u.balance || 0,
    totalDeposit: u.totalDeposit || 0,
    totalWithdraw: u.totalWithdraw || 0,
    suspended: !!u.suspended,
    createdAt: u.createdAt,
    referredby: u.referredby || null,
    accountId: u.accountId,
    activeDeposit: (u.activeDeposit || []).map((d) => ({ stopped: d.stopped })),
  }));
});

export const getPendingRequests = cache(async function getPendingRequests() {
  const session = await requireAdmin();
  if (!session) return null;

  await connectToDB();

  const [depositUsers, withdrawUsers] = await Promise.all([
    User.find({ "deposit.status": "pending" }, "username email deposit").lean(),
    User.find({ "withdraw.status": "pending" }, "username email withdraw").lean(),
  ]);

  const requests = [];

  for (const u of depositUsers) {
    for (const d of u.deposit) {
      if (d.status === "pending") {
        requests.push({
          id: d._id,
          type: "deposit",
          userId: u._id,
          username: u.username,
          email: u.email,
          amount: d.amount,
          method: d.method,
          plan: d.plan,
          date: d.createdAt,
          hasReceipt: !!d.receipt?.url,
          receiptUrl: d.receipt?.url || null,
        });
      }
    }
  }

  for (const u of withdrawUsers) {
    for (const w of u.withdraw) {
      if (w.status === "pending") {
        requests.push({
          id: w._id,
          type: "withdrawal",
          userId: u._id,
          username: u.username,
          email: u.email,
          amount: w.amount,
          method: w.method,
          wallet: w.wallet,
          note: w.note,
          date: w.createdAt,
        });
      }
    }
  }

  requests.sort((a, b) => new Date(b.date) - new Date(a.date));
  return JSON.parse(JSON.stringify(requests));
});

// Full record for the Edit User page — everything an admin is allowed to
// see and change, minus the password hash (no reason to ever ship that to
// the browser, even to an admin).
export const getUserForAdmin = cache(async function getUserForAdmin(id) {
  const session = await requireAdmin();
  if (!session) return null;

  await connectToDB();
  let doc;
  try {
    doc = await User.findById(id).select("-password").lean();
  } catch {
    // Malformed id (not a valid ObjectId) — treat as not found rather than 500.
    return null;
  }
  if (!doc) return null;

  const plain = JSON.parse(JSON.stringify(doc));
  return { ...plain, id: plain._id };
});

export const getUserSummaryByUsername = cache(async function getUserSummaryByUsername(username) {
  const session = await requireAdmin();
  if (!session || !username) return null;

  await connectToDB();
  const doc = await User.findOne({ username }, "username email").lean();
  if (!doc) return null;

  return { id: doc._id.toString(), username: doc.username, email: doc.email };
});
