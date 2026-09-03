import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// This is the piece the old app never got right — every /dashboard and
// /admin request is checked here, server-side, before the page renders.
// Uses the edge-safe config only (see auth.config.js) since middleware runs
// on the Edge Runtime, which can't load Mongoose.
export const { auth: middleware } = NextAuth(authConfig);
export default middleware;

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
