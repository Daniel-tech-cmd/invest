import { auth } from "../../../../../auth";
import { connectToDB } from "../../../../../lib/db";
import Notification from "../../../../../models/Notification";

export async function PATCH(req, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
  }

  const { id } = await params;
  await connectToDB();
  await Notification.findOneAndUpdate({ _id: id, userId: session.user.id }, { read: true });

  return Response.json({ ok: true });
}
