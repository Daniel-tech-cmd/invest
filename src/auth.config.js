// Edge-safe half of the Auth.js config — no Mongoose/bcrypt imports here,
// since middleware runs on the Edge Runtime and neither is Edge-compatible.
// src/auth.js pulls this in and adds the actual Credentials provider on top
// for use in Node-runtime API routes.
//
// The jwt/session callbacks live here (not just in auth.js) because
// middleware runs its own separate NextAuth(authConfig) instance to read the
// session — without these callbacks *in that instance too*, it would only
// ever see the default token fields, never the custom id/username/role
// claims, even though the JWT itself actually contains them. (Found this the
// hard way: an admin login worked, but /admin still redirected them out,
// because middleware's session.user.role was silently undefined.)
export const authConfig = {
  pages: { signIn: "/login" },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;

      const isAdminRoute = pathname.startsWith("/admin");
      const isDashboardRoute = pathname.startsWith("/dashboard");
      const isAdmin = auth?.user?.role === "admin" || auth?.user?.role === "master admin";

      if ((isAdminRoute || isDashboardRoute) && !isLoggedIn) return false;
      if (isAdminRoute && isLoggedIn && !isAdmin) {
        return Response.redirect(new URL("/dashboard", request.nextUrl));
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
      }
      // Impersonation self-expires here rather than relying on the JWT's own
      // `exp` — Auth.js's own session-refresh re-signs the outer token (and
      // its exp) on every /api/auth/session poll, which would otherwise
      // silently extend a "2 hour" impersonation indefinitely. This inner
      // timestamp is the real enforcement, checked on every session read
      // (Edge-safe: no DB call, just reverting to the claims already
      // embedded in the token at impersonation time).
      if (token.impersonatedBy && token.impersonationExpires && Date.now() > token.impersonationExpires) {
        token.id = token.impersonatedBy.id;
        token.username = token.impersonatedBy.username;
        token.role = token.impersonatedBy.role;
        delete token.impersonatedBy;
        delete token.impersonationExpires;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.role = token.role;
      if (token.impersonatedBy) {
        session.user.impersonatedBy = token.impersonatedBy;
      }
      return session;
    },
  },
  providers: [],
};
