import { encode } from "next-auth/jwt";
import { cookies } from "next/headers";

// Impersonation bypasses NextAuth's normal signIn() flow entirely — it needs
// to mint a session for a *different* user than the one making the request,
// which signIn() has no path for. This mints an Auth.js-compatible JWT by
// hand and writes it straight into the session cookie, using the exact same
// encode()/cookie-naming rules Auth.js uses internally, so auth() on the
// next request decodes it exactly as if it had come from a normal sign-in.

function sessionCookieName(secure) {
  return secure ? "__Secure-authjs.session-token" : "authjs.session-token";
}

export async function setSessionToken(payload, { secure } = {}) {
  const useSecure = secure ?? process.env.NODE_ENV === "production";
  const name = sessionCookieName(useSecure);

  const token = await encode({
    token: payload,
    secret: process.env.AUTH_SECRET,
    salt: name, // Auth.js derives the encryption key from the cookie's own name.
  });

  const cookieStore = await cookies();
  cookieStore.set(name, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: useSecure,
  });
}
