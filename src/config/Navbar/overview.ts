import { getRoute } from "@/router";
import { SidebarItem } from ".";

const OverviewSidebarItems = [
  getRoute("overview"),
  getRoute("projects"),
  getRoute("users"),
  getRoute("account"),
] as const satisfies SidebarItem[];

export default OverviewSidebarItems;
