import { auth } from "@/auth";
import { getPath } from "@/router";
import { NextRequest, NextResponse } from "next/server";

export async function AuthMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth();
  const isAuthRoute = pathname.startsWith("/auth");
  const storeSegment = pathname.split("/").find(Boolean);

  if (isAuthRoute) {
    if (session) {
      return NextResponse.redirect(new URL("/", request.url));
    } else {
      return NextResponse.next();
    }
  }

  if (!session) {
    return NextResponse.redirect(new URL(getPath("auth.signin"), request.url));
  }

  if (storeSegment) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-store-id", storeSegment);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}
