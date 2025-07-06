import Paths, {Path} from "@/config/Path";
import { PermissionBit } from "@/config/Permission";
import { maskToPermissions } from "@/libs/permission";
import { User } from "@/libs/user";
import { Session } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function PermissionMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token= await getToken({ req: request }) as any;
  if (!token) return NextResponse.next();
  const user = new User({user: token} as Session);
  const pathConfig = Object.values(Paths).find(path => path.href === pathname || (path.matcher && pathname.startsWith(path.matcher.href)));
  const redirect = () => NextResponse.redirect(new URL(Path('overview').href, request.url));
  if (!pathConfig) return redirect();
  if (!user) return redirect();
  if (!pathConfig.somePermissions) return NextResponse.next();

  const hasPermission = user.hasSomePermissions(pathConfig.somePermissions as (keyof typeof PermissionBit)[] );
  if (!hasPermission) {
    return redirect();
  }

  return NextResponse.next();
}