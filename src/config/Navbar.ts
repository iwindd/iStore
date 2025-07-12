import { PermissionEnum } from "@/enums/permission";
import { Path } from "./Path";

const navItems = [
  { type: "item", path: Path("overview") },
  { type: "item", path: Path("cashier") },

  {
    type: "group",
    key: "product",
    title: "สินค้า",
    items: [
      { path: Path("products") },
      { path: Path("categories") },
      { path: Path("stock") },
    ],
  },
  {
    type: "group",
    key: "etc",
    title: "อื่นๆ",
    items: [
      { path: Path("overstocks") },
      { path: Path("borrows") },
      { path: Path("purchase") },
      { path: Path("histories") },
    ],
  },
  {
    type: "group",
    key: "store",
    title: "ร้านค้า",
    items: [{ path: Path("roles") }, { path: Path("employees") }],
  },
  {
    type: "group",
    key: "store",
    title: "บัญชีของฉัน",
    items: [{ path: Path("account") }],
  },
] as const satisfies NavItemType[];

interface PathConfig {
  key: string;
  title: string;
  href: string;
  icon: string;
  somePermissions?: PermissionEnum[];
}

interface NavTypeItem {
  type: "item";
  path: PathConfig;
}

interface NavTypeGroup {
  type: "group";
  key: string;
  title: string;
  items: { path: PathConfig }[];
}

export type NavItemType = NavTypeItem | NavTypeGroup;
export interface NavItemConfig {
  key: string;
  title?: string;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  icon?: string;
  href?: string;
  items?: NavItemConfig[];
  matcher?: { type: "startsWith" | "equals"; href: string };
  somePermissions?: PermissionEnum[];
}

export default navItems;