import { auth } from "../../../../auth";
import { connectToDB } from "../../../../lib/db";
import User from "../../../../models/User";
import { setSessionToken } from "../../../../lib/sessionCookie";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
  }
  if (!session.user.impersonatedBy) {
    return Response.json({ error: "You're not currently impersonating anyone." }, { status: 400 });
  }

  try {
    await connectToDB();
    // Re-verify against the DB rather than trusting the embedded claim —
    // the admin's role or suspension status could have changed during the
    // impersonation window.
    const admin = await User.findById(session.user.impersonatedBy.id);
    if (!admin || admin.suspended || (admin.role !== "admin" && admin.role !== "master admin")) {
      return Response.json({ error: "Your admin account is no longer valid. Please log in again." }, { status: 403 });
    }

    await setSessionToken({
      id: admin._id.toString(),
      username: admin.username,
      role: admin.role,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
