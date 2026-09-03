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
    const { userId } = await req.json();

    await connectToDB();
    const user = await User.findById(userId);
    if (!user) return Response.json({ error: "User not found." }, { status: 404 });

    const dep = user.deposit.id(id);
    if (!dep) return Response.json({ error: "Deposit request not found." }, { status: 404 });
    if (dep.status !== "pending") {
      return Response.json({ error: `Request already ${dep.status}.` }, { status: 400 });
    }

    const updated = await User.findOneAndUpdate(
      { _id: userId, deposit: { $elemMatch: { _id: id, status: "pending" } } },
      { $set: { "deposit.$.status": "declined" } },
      { new: true },
    );

    if (!updated) {
      return Response.json({ error: "This request was already processed." }, { status: 409 });
    }

    sendEmail(
      updated.email,
      "Deposit Declined",
      `Hello ${updated.username}, your deposit request of ${fmt(dep.amount)} was declined.`,
      renderNotificationEmail({
        heading: "Deposit Declined",
        greeting: updated.username,
        message: "We regret to inform you that your deposit request could not be processed at this time. If you believe this is an error, please contact support.",
        badgeText: "Declined",
        badgeColor: "#991b1b",
        badgeBg: "#fee2e2",
        rows: [
          ["Amount", fmt(dep.amount), true],
          ["Status", "Declined"],
        ],
        ctaText: "Go to Dashboard",
        ctaUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
      }),
    ).catch((err) => console.error("Deposit decline email failed:", err.message));

    sendPush(userId, {
      title: "Deposit declined",
      body: `Your ${fmt(dep.amount)} deposit request was declined.`,
      url: "/dashboard/transactions",
    }).catch((err) => console.error("Deposit decline push failed:", err.message));

    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
