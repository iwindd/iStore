import { auth } from "@/auth";
import { Path } from "@/config/Path";
import { NextRequest, NextResponse } from "next/server";

export async function AuthMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth();

  if (pathname == Path("signin").href || pathname == Path("signup").href) {
    if (session) {
      return NextResponse.redirect(new URL(Path("overview").href, request.url));
    } else {
      return NextResponse.next();
    }
  } else if (!session) {
    return NextResponse.redirect(new URL(Path("signin").href, request.url));
  }

  return NextResponse.next();
}
