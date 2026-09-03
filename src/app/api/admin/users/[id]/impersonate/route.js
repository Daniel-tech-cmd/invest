import { auth } from "../../../../../../auth";
import { connectToDB } from "../../../../../../lib/db";
import User from "../../../../../../models/User";
import { setSessionToken } from "../../../../../../lib/sessionCookie";

export async function POST(req, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "You must be signed in." }, { status: 401 });
  }
  if (session.user.role !== "admin" && session.user.role !== "master admin") {
    return Response.json({ error: "Admin access required." }, { status: 403 });
  }
  if (session.user.impersonatedBy) {
    return Response.json({ error: "You're already impersonating a user. Return to your admin session first." }, { status: 400 });
  }

  try {
    const { id } = await params;

    await connectToDB();
    const target = await User.findById(id);
    if (!target) {
      return Response.json({ error: "User not found." }, { status: 404 });
    }

    if (target.role === "admin" || target.role === "master admin") {
      return Response.json({ error: "Cannot impersonate other administrators." }, { status: 403 });
    }

    await setSessionToken({
      id: target._id.toString(),
      username: target.username,
      role: target.role,
      impersonatedBy: { id: session.user.id, username: session.user.username, role: session.user.role },
      // Enforced in the shared jwt() callback (auth.config.js), not the
      // JWT's own exp — Auth.js re-signs the outer token's exp on every
      // /api/auth/session poll, which would otherwise silently extend this.
      impersonationExpires: Date.now() + 2 * 60 * 60 * 1000,
    });

    console.log(`[ADMIN IMPERSONATION] ${session.user.username} (${session.user.id}) impersonated ${target.username} (${target._id}) at ${new Date().toISOString()}`);

    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
