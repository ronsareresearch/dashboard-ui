import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("auth_token");
  const { pathname } = req.nextUrl;

  // Define protected routes
  const protectedRoutes = [
    "/",                    // homepage
    "/dashboard/whatsapp", // your dashboard page
    "/dashboard/home",
  ];

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/whatsapp/:path*", // matches `/dashboard/whatsapp` and its children
    "/dashboard/home/:path*", // matches `/dashboard/whatsapp` and its children
  ],
};
