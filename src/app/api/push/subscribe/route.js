import { auth } from "../../../../auth";
import { connectToDB } from "../../../../lib/db";
import User from "../../../../models/User";

export async function POST(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
  }

  try {
    const { endpoint, keys } = await req.json();
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return Response.json({ error: "Invalid push subscription." }, { status: 400 });
    }

    await connectToDB();
    // Remove any existing entry for this exact endpoint first (a re-subscribe
    // after the browser rotates its keys shouldn't leave a stale duplicate).
    await User.findByIdAndUpdate(session.user.id, { $pull: { pushSubscriptions: { endpoint } } });
    const updated = await User.findByIdAndUpdate(
      session.user.id,
      { $push: { pushSubscriptions: { endpoint, keys: { p256dh: keys.p256dh, auth: keys.auth } } } },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return Response.json({ error: "User not found." }, { status: 404 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
