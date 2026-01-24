import { getRoute } from "@/router";
import { SidebarItem } from ".";

const OverviewSidebarItems = [
  getRoute("overview"),
] as const satisfies SidebarItem[];

export default OverviewSidebarItems;
