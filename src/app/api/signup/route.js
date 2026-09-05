import bcrypt from "bcryptjs";
import { connectToDB } from "../../../lib/db";
import User from "../../../models/User";
import sendEmail from "../../../lib/sendEmail";
import sendPush from "../../../lib/sendPush";
import { renderNotificationEmail } from "../../../lib/emailTemplates";

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

    const newUser = await User.create({
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

    sendEmail(
      newUser.email,
      "Welcome to GoldGroveco",
      `Hello ${newUser.username}, welcome to GoldGroveco! Your account is ready — head to your dashboard to make your first deposit.`,
      renderNotificationEmail({
        heading: "Welcome to GoldGroveco",
        greeting: newUser.username,
        message: "Thanks for joining GoldGroveco. Your account is ready to go — explore the dashboard, check out our investment plans, and make your first deposit whenever you're ready.",
        badgeText: "Account Created",
        ctaText: "Go to Dashboard",
        ctaUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
      }),
    ).catch((err) => console.error("Welcome email failed:", err.message));

    sendPush(newUser._id, {
      title: "Welcome to GoldGroveco",
      body: "Your account is ready. Explore the dashboard to get started.",
      url: "/dashboard",
    }).catch((err) => console.error("Welcome push failed:", err.message));

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
