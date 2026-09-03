import { auth } from "../../../../auth";
import { connectToDB } from "../../../../lib/db";
import User from "../../../../models/User";

export async function POST(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
  }

  try {
    const { endpoint } = await req.json();
    if (!endpoint) {
      return Response.json({ error: "Missing endpoint." }, { status: 400 });
    }

    await connectToDB();
    await User.findByIdAndUpdate(session.user.id, { $pull: { pushSubscriptions: { endpoint } } });

    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
