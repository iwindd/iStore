import { findActiveRoute } from "@/router";
import { usePathname } from "next/navigation";

export function useActiveRouteConfig() {
  const pathname = usePathname();
  const activeRoute = findActiveRoute(pathname);
  return activeRoute;
}
