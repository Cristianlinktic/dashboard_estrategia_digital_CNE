import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE = "dashboard_auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths (login page and auth API)
  const isPublic =
    pathname === "/login" ||
    pathname.startsWith("/api/auth");

  // Build response and inject pathname header so root layout can detect /login
  let response: NextResponse;

  if (!isPublic) {
    // Check auth cookie
    const cookie = request.cookies.get(AUTH_COOKIE);
    if (!cookie || !["admin", "viewer"].includes(cookie.value)) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      response = NextResponse.redirect(loginUrl);
      response.headers.set("x-pathname", "/login");
      return response;
    }
    
    // Set user role header
    const role = cookie.value;
    response = NextResponse.next();
    response.headers.set("x-user-role", role);
    response.headers.set("x-pathname", pathname);
    return response;
  }

  response = NextResponse.next();
  // Forward the real pathname as a header so server components can read it
  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
};
