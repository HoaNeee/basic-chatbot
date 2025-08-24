import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("jwt_token")?.value;
  const isGuest = request.cookies.get("is_guest")?.value === "true";

  const pathName = request.nextUrl.pathname;

  if (
    (pathName.startsWith("/login") || pathName.startsWith("/register")) &&
    !isGuest &&
    token
  ) {
    return NextResponse.redirect(new URL(`/`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
