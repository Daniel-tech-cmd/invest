import bcrypt from "bcryptjs";
import { connectToDB } from "../../../lib/db";
import User from "../../../models/User";

function generateAccountId() {
  return "GGC-" + Math.floor(100000 + Math.random() * 900000);
}

export async function POST(req) {
  try {
    const { email, username, password, gender, referralCode } = await req.json();

    if (!email || !username || !password || !gender) {
      return Response.json({ error: "All fields must be filled!" }, { status: 400 });
    }
    if (password.length < 6) {
      return Response.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    await connectToDB();

    const normalizedEmail = String(email).toLowerCase().trim();

    const [existingEmail, existingUsername] = await Promise.all([
      User.findOne({ email: normalizedEmail }),
      User.findOne({ username }),
    ]);
    if (existingEmail) return Response.json({ error: "Email already in use" }, { status: 409 });
    if (existingUsername) return Response.json({ error: "Username already in use" }, { status: 409 });

    let referredby = null;
    if (referralCode) {
      const referrer = await User.findOne({ username: String(referralCode).trim() });
      if (referrer) referredby = referrer.username;
    }

    const hash = await bcrypt.hash(password, 10);

    let accountId;
    do {
      accountId = generateAccountId();
      // eslint-disable-next-line no-await-in-loop
    } while (await User.findOne({ accountId }));

    await User.create({
      email: normalizedEmail,
      username,
      password: hash,
      gender: String(gender).toLowerCase(),
      accountId,
      referredby,
    });

    if (referredby) {
      await User.updateOne({ username: referredby }, { $push: { referals: { username, verified: false } } });
    }

    return Response.json({ ok: true }, { status: 201 });
  } catch (err) {
    if (err.code === 11000) {
      return Response.json({ error: "Email or username already in use" }, { status: 409 });
    }
    if (err.name === "ValidationError") {
      const firstError = Object.values(err.errors)[0]?.message || "Invalid input";
      return Response.json({ error: firstError }, { status: 400 });
    }
    console.error(err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
