import { authConfig } from "@/auth.config";
import NextAuth from "next-auth";
const { auth } = NextAuth(authConfig);

import { NextResponse } from "next/server";

export default auth(async function middleware(req) {
  const session = await auth();
  const pathname = req.nextUrl.pathname;

  // Redirect logged-in users away from /signin
  if (pathname === "/signin" && session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    if (!session) {
      // Not signed in → redirect to signin
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    const role = session.user?.role;

    if (role !== "admin") {
      // Signed in but not an admin → redirect home
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Allow all other requests
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
