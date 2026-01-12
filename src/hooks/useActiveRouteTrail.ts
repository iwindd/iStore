import { findRouteTrail } from "@/router";
import { usePathname } from "next/navigation";

export function useActiveRouteTrail() {
  const pathname = usePathname();
  const trail = findRouteTrail(pathname);
  return trail ?? [];
}
