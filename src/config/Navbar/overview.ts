import { getRoute } from "@/router";
import { NavbarItem } from ".";

const OverviewNavbarItems = [
  getRoute("overview"),
] as const satisfies NavbarItem[];

export default OverviewNavbarItems;
