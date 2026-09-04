import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protect /admin/* (except the login page itself which handles its own state).
// Customer /account/* is protected via page-level checks so guests see friendly UI.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin")) {
    // Allow the login screen to render; client will redirect when authed.
    if (pathname === "/admin") return NextResponse.next();
    const session = req.cookies.get("if_admin")?.value;
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}
export const config = { matcher: ["/admin/:path*"] };
