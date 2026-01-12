import { NextRequest, NextResponse } from "next/server";

export async function PermissionMiddleware(request: NextRequest) {
  //TODO:: REFACTOR

  /*   const { pathname } = request.nextUrl;
  const session = await auth();
  if (!session) return NextResponse.next();
  const user = new User(session);
  const pathConfig = Object.values(Paths).find((path) => {
    if (path.href === pathname) return true;
    if (
      "matcher" in path &&
      path.matcher &&
      pathname.startsWith(path.matcher.href)
    )
      return true;
    return false;
  });
  const redirect = () =>
    NextResponse.redirect(new URL(getPath("overview"), request.url));

  if (!pathConfig) return NextResponse.next();
  if (!user) return redirect();
  if (!("somePermissions" in pathConfig) || !pathConfig.somePermissions)
    return NextResponse.next();

  const hasPermission = user.hasSomePermissions(...pathConfig.somePermissions);
  if (!hasPermission) {
    return redirect();
  }
 */
  return NextResponse.next();
}
