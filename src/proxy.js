import { NextResponse } from "next/server";

const PROTECTED_PATHS = [
  "/dashboard",
  "/deposit",
  "/withdraw",
  "/history",
  "/profile",
  "/reinvest",
  "/referrals",
  "/admin",
];

export default function proxy(req) {
  const { pathname } = req.nextUrl;
  const verifyuser = req.cookies.get("user");

  let userValue = null;
  if (verifyuser?.value) {
    try {
      userValue = JSON.parse(
        decodeURIComponent(verifyuser.value),
      );
    } catch {
      userValue = null;
    }
  }

  const isProtected = PROTECTED_PATHS.some((p) =>
    pathname.startsWith(p),
  );

  if (isProtected && !userValue) {
    console.log(
      "User not authenticated, redirecting to login.",
    );
    return NextResponse.redirect(
      new URL("/login", req.url),
    );
  }

  if (
    pathname.startsWith("/admin") &&
    userValue
  ) {
    if (
      userValue.role !== "admin" &&
      userValue.role !== "master admin"
    ) {
      return NextResponse.redirect(
        new URL("/not-found", req.url),
      );
    }
  }

  if (
    pathname.startsWith("/ref") &&
    req.nextUrl.searchParams.has("r")
  ) {
    return NextResponse.redirect(
      new URL("/signup", req.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/deposit/:path*",
    "/withdraw/:path*",
    "/history/:path*",
    "/profile/:path*",
    "/reinvest/:path*",
    "/referrals/:path*",
    "/admin/:path*",
    "/ref",
  ],
};
