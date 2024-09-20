import { type NextRequest, NextResponse } from "next/server";
import { createRouteMatcher } from "./utils/route-matcher";

const isProxyRoute = createRouteMatcher(["/proxy/(.*)"]);

export const middleware = async (req: NextRequest) => {
  if (isProxyRoute(req)) {
    const newResponse = NextResponse.next();
    newResponse.headers.set("x-auth-token", process.env.BTP_TOKEN ?? "");
    return newResponse;
  }
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
