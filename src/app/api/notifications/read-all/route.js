import { auth } from "../../../../auth";
import { connectToDB } from "../../../../lib/db";
import Notification from "../../../../models/Notification";

export async function PATCH() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
  }

  await connectToDB();
  await Notification.updateMany({ userId: session.user.id, read: false }, { read: true });

  return Response.json({ ok: true });
}
