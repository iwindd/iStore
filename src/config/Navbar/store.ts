import { getRoute } from "@/router";
import { SidebarItem } from ".";

const StoreSidebarItems = [
  getRoute("store.dashboard"),
  getRoute("store.cashier"),

  {
    key: "work",
    title: "การขาย",
    routes: [getRoute("store.preorders"), getRoute("store.consignments")],
    defaultExpand: true,
  },
  {
    key: "product",
    title: "สินค้า",
    routes: [getRoute("store.products"), getRoute("store.stocks")],
    defaultExpand: true,
  },

  {
    key: "etc",
    title: "อื่นๆ",
    routes: [
      getRoute("store.histories"),
      getRoute("store.categories"),
      getRoute("store.promotions"),
      getRoute("store.broadcasts"),
    ],
    defaultExpand: true,
  },
  {
    key: "store",
    title: "ร้านค้า",
    routes: [
      getRoute("store.applications"),
      getRoute("store.roles"),
      getRoute("store.employees"),
      getRoute("store.store"),
    ],
  },
  {
    key: "account",
    title: "บัญชีของฉัน",
    routes: [getRoute("store.account")],
  },
] as const satisfies SidebarItem[];

export default StoreSidebarItems;
