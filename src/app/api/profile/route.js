import { auth } from "../../../auth";
import { connectToDB } from "../../../lib/db";
import User from "../../../models/User";

// Strict whitelist — the old app's exact bug was passing the whole raw
// request body straight into findByIdAndUpdate, which let role/balance/
// suspended/verified all be set through the "edit your own profile" form.
// Only these fields are ever touched here, and only for the signed-in user's
// own document.
const EDITABLE_FIELDS = [
  "fullName",
  "username",
  "email",
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

export async function PATCH(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
  }

  try {
    const body = await req.json();

    const update = {};
    for (const field of EDITABLE_FIELDS) {
      if (body[field] !== undefined) update[field] = body[field];
    }

    await connectToDB();

    if (update.username !== undefined) {
      const username = String(update.username).trim();
      if (!/^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(username)) {
        return Response.json({ error: "Username must be 4-20 alphanumeric characters." }, { status: 400 });
      }
      const existingUsername = await User.findOne({ username, _id: { $ne: session.user.id } });
      if (existingUsername) {
        return Response.json({ error: "Username already in use." }, { status: 409 });
      }
      update.username = username;
    }

    if (update.email !== undefined) {
      const email = String(update.email).toLowerCase().trim();
      const existingEmail = await User.findOne({ email, _id: { $ne: session.user.id } });
      if (existingEmail) {
        return Response.json({ error: "Email already in use." }, { status: 409 });
      }
      update.email = email;
    }

    const updated = await User.findByIdAndUpdate(session.user.id, update, { new: true, runValidators: true });
    if (!updated) {
      return Response.json({ error: "User not found." }, { status: 404 });
    }

    return Response.json({
      ok: true,
      profile: { fullName: updated.fullName, username: updated.username, email: updated.email },
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
