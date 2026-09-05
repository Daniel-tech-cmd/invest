import { auth } from "../../../../../../auth";
import { connectToDB } from "../../../../../../lib/db";
import User from "../../../../../../models/User";
import sendEmail from "../../../../../../lib/sendEmail";
import sendPush from "../../../../../../lib/sendPush";
import { renderNotificationEmail } from "../../../../../../lib/emailTemplates";

const fmt = (n) => `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export async function POST(req, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
  }
  if (session.user.role !== "admin" && session.user.role !== "master admin") {
    return Response.json({ error: "Admin access required." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const { amount } = await req.json();
    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      return Response.json({ error: "Please enter a valid amount." }, { status: 400 });
    }

    await connectToDB();
    const updated = await User.findByIdAndUpdate(
      id,
      {
        $inc: { promoBonus: numericAmount },
        $push: { bonusHistory: { type: "promo", amount: numericAmount, note: "Promo bonus from admin" } },
      },
      { new: true, runValidators: true },
    );
    if (!updated) {
      return Response.json({ error: "User not found." }, { status: 404 });
    }

    sendEmail(
      updated.email,
      "Promo Bonus Added to Your Account",
      `Hello ${updated.username}, a promotional bonus of ${fmt(numericAmount)} has been added to your account.`,
      renderNotificationEmail({
        heading: "Promo Bonus Added",
        greeting: updated.username,
        message: "We have some exciting news! A promotional bonus has been added to your account and is available immediately.",
        badgeText: "Bonus Added",
        rows: [
          ["Bonus amount", fmt(numericAmount), true],
          ["New promo balance", fmt(updated.promoBonus)],
        ],
        noteText: "Profit calculations are based on your actual deposits only — this bonus is separate and available for withdrawal or reinvestment on its own.",
        ctaText: "View Dashboard",
        ctaUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
      }),
    ).catch((err) => console.error("Promo bonus email failed:", err.message));

    sendPush(id, {
      title: "Promo bonus added",
      body: `${fmt(numericAmount)} was added to your promo balance.`,
      url: "/dashboard",
    }).catch((err) => console.error("Promo bonus push failed:", err.message));

    return Response.json({ ok: true, promoBonus: updated.promoBonus });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
