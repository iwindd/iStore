import { getRoute } from "@/router";
import { SidebarItem } from ".";

const OverviewSidebarItems = [
  getRoute("overview"),
  getRoute("projects"),
  getRoute("overview.account"),
] as const satisfies SidebarItem[];

export default OverviewSidebarItems;
