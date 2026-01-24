import { getRoute } from "@/router";
import { SidebarItem } from ".";

const StoreSidebarItems = [
  getRoute("projects.store.dashboard"),
  getRoute("projects.store.cashier"),
  {
    key: "work",
    title: "การขาย",
    routes: [
      getRoute("projects.store.preorders"),
      getRoute("projects.store.consignments"),
    ],
    defaultExpand: true,
  },
  {
    key: "product",
    title: "สินค้า",
    routes: [
      getRoute("projects.store.products"),
      getRoute("projects.store.stocks"),
    ],
    defaultExpand: true,
  },
  {
    key: "etc",
    title: "อื่นๆ",
    routes: [
      getRoute("projects.store.histories"),
      getRoute("projects.store.categories"),
      getRoute("projects.store.promotions"),
      getRoute("projects.store.broadcasts"),
    ],
    defaultExpand: true,
  },
  {
    key: "store",
    title: "ร้านค้า",
    routes: [
      getRoute("projects.store.applications"),
      getRoute("projects.store.roles"),
      getRoute("projects.store.employees"),
    ],
  },
  {
    key: "account",
    title: "บัญชีของฉัน",
    defaultExpand: true,
    routes: [getRoute("projects.store.account")],
  },
] as const satisfies SidebarItem[];

export default StoreSidebarItems;
