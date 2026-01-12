import { auth } from "@/auth";
import { getPath } from "@/router";
import { NextRequest, NextResponse } from "next/server";

export async function AuthMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth();

  if (
    pathname == getPath("auth.signin") ||
    pathname == getPath("auth.signup")
  ) {
    if (session) {
      return NextResponse.redirect(new URL(getPath("overview"), request.url));
    } else {
      return NextResponse.next();
    }
  } else if (!session) {
    return NextResponse.redirect(new URL(getPath("auth.signin"), request.url));
  }

  return NextResponse.next();
}
