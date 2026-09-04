import webpush from "web-push";
import { connectToDB } from "./db";
import User from "../models/User";

let configured = false;
function ensureConfigured() {
  if (configured) return;
  if (!process.env.VAPID_PRIVATE_KEY || !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
    throw new Error("Web Push is not configured — add VAPID_PRIVATE_KEY / NEXT_PUBLIC_VAPID_PUBLIC_KEY to .env.local");
  }
  webpush.setVapidDetails(
    "mailto:support@goldgroveco.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  );
  configured = true;
}

// Fire-and-forget, matches the existing sendEmail() pattern — a push
// failure never blocks the underlying operation that triggered it. Sends to
// every device the user has subscribed on, and prunes any subscription the
// push service reports as gone (410) or not found (404) rather than
// retrying it forever.
// Returns { subscriptions, sent } so callers that need to know outcome (the
// broadcast tool, mainly — one recipient can have zero devices subscribed,
// which isn't a failure so much as "not applicable") can report accurately.
// Every existing fire-and-forget caller just ignores the return value.
export default async function sendPush(userId, { title, body, url }) {
  ensureConfigured();
  await connectToDB();

  const user = await User.findById(userId).select("pushSubscriptions");
  if (!user || !user.pushSubscriptions?.length) return { subscriptions: 0, sent: 0 };

  const payload = JSON.stringify({ title, body, url: url || "/dashboard" });
  const deadEndpoints = [];
  let sent = 0;

  await Promise.all(
    user.pushSubscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth } }, payload);
        sent++;
      } catch (err) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          deadEndpoints.push(sub.endpoint);
        } else {
          console.error("Push send failed:", err.message);
        }
      }
    }),
  );

  if (deadEndpoints.length > 0) {
    await User.findByIdAndUpdate(userId, { $pull: { pushSubscriptions: { endpoint: { $in: deadEndpoints } } } });
  }

  return { subscriptions: user.pushSubscriptions.length, sent };
}
