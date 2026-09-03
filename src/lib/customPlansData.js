import { cache } from "react";
import { auth } from "../auth";
import { connectToDB } from "./db";
import CustomPlan from "../models/CustomPlan";
import User from "../models/User";
import { PLANS } from "../app/lib/plans";

function toPlain(doc) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    rate: doc.rate,
    days: doc.days,
    min: doc.min,
    visibility: doc.visibility,
    userId: doc.userId ? doc.userId.toString() : null,
  };
}

// Every custom plan a given user can currently see: public ones, plus their
// own private plan(s) if any. Used to build that user's Deposit/Reinvest
// plan catalog, and to resolve maturity progress for their active deposits.
export async function getCustomPlansForUser(userId) {
  await connectToDB();
  const docs = await CustomPlan.find({ $or: [{ visibility: "public" }, { visibility: "private", userId }] }).lean();
  return docs.map(toPlain);
}

// Standard PLANS + public custom plans, UNLESS the user has a private plan
// assigned, in which case the standard catalog is replaced entirely by their
// private + public plans.
export function buildPlanCatalog(standardPlans, customPlansForUser) {
  const privateForUser = customPlansForUser.filter((p) => p.visibility === "private");
  const publicForUser = customPlansForUser.filter((p) => p.visibility === "public");

  const customEntries = [...privateForUser, ...publicForUser].map((p) => [
    p.name,
    { rate: p.rate, days: p.days, min: p.min, custom: true, visibility: p.visibility },
  ]);

  if (privateForUser.length > 0) {
    return Object.fromEntries(customEntries);
  }
  return { ...standardPlans, ...Object.fromEntries(customEntries) };
}

export async function getPlanCatalogForUser(userId, standardPlans) {
  const customPlansForUser = await getCustomPlansForUser(userId);
  return buildPlanCatalog(standardPlans, customPlansForUser);
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  if (session.user.role !== "admin" && session.user.role !== "master admin") return null;
  return session;
}

// Admin listing — resolves each private plan's assigned username in one
// batched query rather than N+1 lookups.
export const getAllCustomPlansForAdmin = cache(async function getAllCustomPlansForAdmin() {
  const session = await requireAdmin();
  if (!session) return null;

  await connectToDB();
  const docs = await CustomPlan.find({}).sort({ createdAt: -1 }).lean();
  const plain = docs.map(toPlain);

  const userIds = [...new Set(plain.filter((p) => p.userId).map((p) => p.userId))];
  const users = userIds.length ? await User.find({ _id: { $in: userIds } }, "username").lean() : [];
  const usernameById = new Map(users.map((u) => [u._id.toString(), u.username]));

  return plain.map((p) => ({ ...p, assignedUsername: p.userId ? usernameById.get(p.userId) || null : null }));
});

export const getCustomPlanForAdmin = cache(async function getCustomPlanForAdmin(id) {
  const session = await requireAdmin();
  if (!session) return null;

  await connectToDB();
  let doc;
  try {
    doc = await CustomPlan.findById(id).lean();
  } catch {
    return null;
  }
  return doc ? toPlain(doc) : null;
});

// A plan name collision silently clobbers one plan with another wherever
// they'd both end up in the same user's merged catalog (the catalog is
// keyed by name) — reject it outright instead of letting that happen quietly.
export async function findPlanNameCollision({ name, visibility, userId, excludeId }) {
  const lower = name.trim().toLowerCase();
  if (Object.keys(PLANS).some((p) => p.toLowerCase() === lower)) {
    return "That name matches one of the standard plan names.";
  }

  const query = { name: new RegExp(`^${name.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") };
  if (excludeId) query._id = { $ne: excludeId };

  const candidates = await CustomPlan.find(query).lean();
  for (const c of candidates) {
    if (c.visibility === "public" || visibility === "public") {
      // Two publics, or a public and any private, always end up merged for someone.
      return `A ${c.visibility} plan named "${c.name}" already exists.`;
    }
    if (c.visibility === "private" && visibility === "private" && String(c.userId) === String(userId)) {
      return "This user already has a private plan with that name.";
    }
  }
  return null;
}
