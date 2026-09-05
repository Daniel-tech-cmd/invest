import { cache } from "react";
import { auth } from "../auth";
import { connectToDB } from "./db";
import Notification from "../models/Notification";

function toPlain(doc) {
  return {
    id: doc._id,
    title: doc.title,
    body: doc.body,
    url: doc.url,
    read: doc.read,
    createdAt: doc.createdAt,
  };
}

export const getNotificationsForUser = cache(async function getNotificationsForUser() {
  const session = await auth();
  if (!session?.user?.id) return { notifications: [], unreadCount: 0 };

  await connectToDB();
  const [notifications, unreadCount] = await Promise.all([
    Notification.find({ userId: session.user.id }).sort({ createdAt: -1 }).limit(50).lean(),
    Notification.countDocuments({ userId: session.user.id, read: false }),
  ]);

  return {
    notifications: JSON.parse(JSON.stringify(notifications)).map(toPlain),
    unreadCount,
  };
});

export const getUnreadNotificationCount = cache(async function getUnreadNotificationCount() {
  const session = await auth();
  if (!session?.user?.id) return 0;

  await connectToDB();
  return Notification.countDocuments({ userId: session.user.id, read: false });
});
