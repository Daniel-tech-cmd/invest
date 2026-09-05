import { auth } from "../../../auth";
import { connectToDB } from "../../../lib/db";
import Notification from "../../../models/Notification";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
  }

  await connectToDB();
  const [notifications, unreadCount] = await Promise.all([
    Notification.find({ userId: session.user.id }).sort({ createdAt: -1 }).limit(50).lean(),
    Notification.countDocuments({ userId: session.user.id, read: false }),
  ]);

  return Response.json({
    notifications: notifications.map((n) => ({
      id: n._id,
      title: n.title,
      body: n.body,
      url: n.url,
      read: n.read,
      createdAt: n.createdAt,
    })),
    unreadCount,
  });
}
