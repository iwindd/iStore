import { getRoute } from "@/router";
import { SidebarItem } from ".";

const OverviewSidebarItems = [
  getRoute("overview"),
  {
    key: "business",
    title: "ธุรกิจ",
    defaultExpand: true,
    routes: [getRoute("projects"), getRoute("users")],
  },
  {
    key: "account",
    title: "บัญชีของฉัน",
    defaultExpand: true,
    routes: [getRoute("account")],
  },
] as const satisfies SidebarItem[];

export default OverviewSidebarItems;
