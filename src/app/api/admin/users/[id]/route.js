import { auth } from "../../../../../auth";
import { connectToDB } from "../../../../../lib/db";
import User from "../../../../../models/User";

// Everything an admin is allowed to touch on this page — the old app's
// equivalent endpoint took the entire raw request body with zero
// restriction (that's the same endpoint Profile Update used to share, and
// the same bug applies here — just with a legitimately wider field set
// this time, since this really is an admin editing someone else's account).
const EDITABLE_FIELDS = [
  "username",
  "email",
  "role",
  "number",
  "country",
  "balance",
  "minimumWithdrawal",
  "verified",
  "suspended",
  "restrictionMessage",
  "bitcoinAccountId",
  "bitcoinNetwork",
  "ethereumAccountId",
  "ethereumNetwork",
  "litecoinAccountId",
  "litecoinNetwork",
  "dogeAccountId",
  "dogeNetwork",
  "usdtAccountId",
  "usdtNetwork",
];

export async function PATCH(req, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
  }
  if (session.user.role !== "admin" && session.user.role !== "master admin") {
    return Response.json({ error: "Admin access required." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    await connectToDB();
    const target = await User.findById(id);
    if (!target) {
      return Response.json({ error: "User not found." }, { status: 404 });
    }

    const update = {};
    for (const field of EDITABLE_FIELDS) {
      if (body[field] !== undefined) update[field] = body[field];
    }

    if (update.username !== undefined) {
      const username = String(update.username).trim();
      if (!/^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(username)) {
        return Response.json({ error: "Username must be 4-20 alphanumeric characters." }, { status: 400 });
      }
      const existingUsername = await User.findOne({ username, _id: { $ne: id } });
      if (existingUsername) {
        return Response.json({ error: "Username already in use." }, { status: 409 });
      }
      update.username = username;
    }

    if (update.email !== undefined) {
      const email = String(update.email).toLowerCase().trim();
      const existingEmail = await User.findOne({ email, _id: { $ne: id } });
      if (existingEmail) {
        return Response.json({ error: "Email already in use." }, { status: 409 });
      }
      update.email = email;
    }

    if (update.role !== undefined && !["user", "admin", "master admin"].includes(update.role)) {
      return Response.json({ error: "Invalid role." }, { status: 400 });
    }

    // Balance change + a chosen plan credits an activeDeposit entry — the
    // old app did this too, but also kept a second, redundant `plans[]`
    // array in sync with the same information. We only have activeDeposit.
    const { plan } = body;
    if (update.balance !== undefined && plan) {
      const newBalance = Number(update.balance);
      const delta = newBalance - (target.balance || 0);

      if (delta !== 0) {
        const existing = target.activeDeposit.find((d) => d.plan === plan && !d.stopped);
        if (existing) {
          existing.amount += delta;
          existing.date = new Date();
        } else {
          target.activeDeposit.push({ plan, amount: delta, date: new Date(), stopped: false, withdrawn: false });
        }
      }
    }

    Object.assign(target, update);
    await target.save();

    return Response.json({
      ok: true,
      user: { id: target._id, username: target.username, email: target.email, role: target.role },
    });
  } catch (err) {
    if (err.code === 11000) {
      return Response.json({ error: "Username or email already in use." }, { status: 409 });
    }
    if (err.name === "ValidationError") {
      const firstError = Object.values(err.errors)[0]?.message || "Invalid input";
      return Response.json({ error: firstError }, { status: 400 });
    }
    console.error(err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
