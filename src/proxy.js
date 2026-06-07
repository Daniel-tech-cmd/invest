import { NextResponse } from "next/server";

export default function proxy(req) {
  const verifyuser = req.cookies.get("user");
  let userValue;
  if (verifyuser) {
    try {
      userValue = JSON.parse(verifyuser.value);
    } catch {
      // Malformed cookie — treat as unauthenticated
      userValue = null;
    }
  }
  const url = req.url;
  if (!verifyuser && url.includes("/admin")) {
    return NextResponse.redirect(
      "https://www.goldgroveco.com/not-found",
    );
  }
  if (
    !verifyuser &&
    url.includes(
      "https://www.goldgroveco.com/dashboard",
    )
  ) {
    return NextResponse.redirect(
      "https://www.goldgroveco.com/login",
    );
  }
  if (
    !verifyuser &&
    url.includes(
      "https://www.goldgroveco.com/deposit",
    )
  ) {
    return NextResponse.redirect(
      "https://www.goldgroveco.com/login",
    );
  }
  if (!verifyuser && url.includes("/history")) {
    return NextResponse.redirect(
      "https://www.goldgroveco.com/login",
    );
  }
  if (!verifyuser && url.includes("/withdraw")) {
    return NextResponse.redirect(
      "https://www.goldgroveco.com/login",
    );
  }
  if (!verifyuser && url.includes("/profile")) {
    return NextResponse.redirect(
      "https://www.goldgroveco.com/login",
    );
  }

  if (url.includes("/ref?r")) {
    return NextResponse.redirect(
      "https://www.goldgroveco.com/signup",
    );
  }

  if (verifyuser && url.includes("/admin")) {
    try {
      if (userValue.role === "admin") {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(
          "https://www.goldgroveco.com/not-found",
        );
      }
    } catch (error) {
      return NextResponse.redirect(
        "https://www.goldgroveco.com/not-found",
      );
    }
  }

  return NextResponse.next();
}
