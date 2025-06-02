import { authConfig } from "@/auth.config";
import NextAuth from "next-auth";
const { auth } = NextAuth(authConfig);

import { NextResponse } from "next/server";

export default auth(async function middleware(req) {
  const session = await auth();

  if (req.nextUrl.pathname === "/signin" && req.auth) {
    if (session) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (req.nextUrl.pathname === "/") {
    return;
  }

  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
