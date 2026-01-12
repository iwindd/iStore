import { findActiveRoute, getParamsFromPath } from "@/router";
import { usePathname } from "next/navigation";

export function useActiveRouteParams<T>(): T {
  const pathname = usePathname();
  const activeRoute = findActiveRoute(pathname);
  if (!activeRoute) return {} as T;
  const params = getParamsFromPath(activeRoute.name, pathname);

  return params as T;
}
