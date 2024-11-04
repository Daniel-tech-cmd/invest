import { NextResponse } from "next/server";

export default function middleware(req) {
  const verifyuser = req.cookies.get("user");
  let userValue;
  if (verifyuser) {
    userValue = JSON.parse(verifyuser?.value);
  }
  const url = req.url;
  const secret = process.env.SECRET;
  if (!verifyuser && url.includes("/admin")) {
    return NextResponse.redirect("https://www.goldgroveco.com/not-found");
  }
  if (!verifyuser && url.includes("https://www.goldgroveco.com/dashboard")) {
    return NextResponse.redirect("https://www.goldgroveco.com/login");
  }
  if (!verifyuser && url.includes("https://www.goldgroveco.com/deposit")) {
    return NextResponse.redirect("https://www.goldgroveco.com/login");
  }
  if (!verifyuser && url.includes("/history")) {
    return NextResponse.redirect("https://www.goldgroveco.com/login");
  }
  if (!verifyuser && url.includes("/withdraw")) {
    return NextResponse.redirect("https://www.goldgroveco.com/login");
  }
  if (!verifyuser && url.includes("/profile")) {
    return NextResponse.redirect("https://www.goldgroveco.com/login");
  }

  if (url.includes("https://goldgroveco.com?ref")) {
    return NextResponse.redirect("https://www.goldgroveco.com/login");
  }

  if (verifyuser && url.includes("/admin")) {
    try {
      const verifiedToken = true;
      if (userValue.role === "admin") {
        return NextResponse.next();
      } else if (userValue.role !== "admin") {
        return NextResponse.redirect("https://www.goldgroveco.com/not-found");
      } else {
        return NextResponse.redirect("https://www.goldgroveco.com/not-found");
      }
    } catch (error) {
      return NextResponse.redirect("https://www.goldgroveco.com/not-found");
    }
  }

  return NextResponse.next();
}
