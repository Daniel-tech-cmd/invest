import { auth } from "../../../../auth";
import { connectToDB } from "../../../../lib/db";
import User from "../../../../models/User";
import sendEmail from "../../../../lib/sendEmail";
import sendPush from "../../../../lib/sendPush";
import { renderNotificationEmail } from "../../../../lib/emailTemplates";

export const maxDuration = 60;

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Sent in small batches rather than all at once — keeps this well under
// Resend's/the push service's rate limits and the route's own execution
// time budget even for a large recipient list, without needing a
// background job queue for what's still a bounded, one-off admin action.
const BATCH_SIZE = 10;

export async function POST(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
  }
  if (session.user.role !== "admin" && session.user.role !== "master admin") {
    return Response.json({ error: "Admin access required." }, { status: 403 });
  }

  try {
    const { recipientIds, subject, message, channels } = await req.json();
    const sendViaEmail = channels?.email !== false; // default true if omitted
    const sendViaPush = !!channels?.push;

    if (!subject?.trim() || !message?.trim()) {
      return Response.json({ error: "Subject and message are required." }, { status: 400 });
    }
    if (!sendViaEmail && !sendViaPush) {
      return Response.json({ error: "Choose at least one delivery channel." }, { status: 400 });
    }

    await connectToDB();

    let recipients;
    if (recipientIds === "all") {
      recipients = await User.find({}, "username email").lean();
    } else {
      if (!Array.isArray(recipientIds) || recipientIds.length === 0) {
        return Response.json({ error: "Select at least one recipient." }, { status: 400 });
      }
      recipients = await User.find({ _id: { $in: recipientIds } }, "username email").lean();
    }

    if (recipients.length === 0) {
      return Response.json({ error: "No matching recipients found." }, { status: 400 });
    }

    const htmlMessage = escapeHtml(message.trim()).replace(/\n/g, "<br />");

    const email = { sent: 0, failed: 0 };
    const push = { sent: 0, notSubscribed: 0, failed: 0 };

    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const batch = recipients.slice(i, i + BATCH_SIZE);

      // Each task always resolves (never rejects) and self-tags its
      // channel + outcome, so a failure never has to be guessed at from a
      // bare rejection in a mixed email+push batch.
      const batchResults = await Promise.all(
        batch.flatMap((r) => {
          const tasks = [];
          if (sendViaEmail) {
            tasks.push(
              sendEmail(
                r.email,
                subject,
                message,
                renderNotificationEmail({
                  heading: subject,
                  greeting: r.username,
                  message: htmlMessage,
                  badgeText: "Announcement",
                  ctaText: "View Dashboard",
                  ctaUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
                }),
              )
                .then(() => ({ channel: "email", ok: true }))
                .catch((err) => ({ channel: "email", ok: false, error: err })),
            );
          }
          if (sendViaPush) {
            tasks.push(
              sendPush(r._id, { title: subject, body: message.trim(), url: "/dashboard" })
                .then((result) => ({ channel: "push", ok: true, result }))
                .catch((err) => ({ channel: "push", ok: false, error: err })),
            );
          }
          return tasks;
        }),
      );

      for (const r of batchResults) {
        if (r.channel === "email") {
          if (r.ok) email.sent++;
          else {
            email.failed++;
            console.error("Broadcast email failed:", r.error?.message);
          }
        } else if (r.channel === "push") {
          if (!r.ok) {
            push.failed++;
            console.error("Broadcast push failed:", r.error?.message);
          } else if (r.result.subscriptions === 0) push.notSubscribed++;
          else if (r.result.sent > 0) push.sent++;
          else push.failed++;
        }
      }
    }

    return Response.json({
      ok: true,
      total: recipients.length,
      email: sendViaEmail ? email : null,
      push: sendViaPush ? push : null,
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
