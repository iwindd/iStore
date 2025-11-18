import { PermissionEnum } from "@/enums/permission";
import { Path } from "./Path";

/**
 *
 * ก่อนจะเพิ่ม navbar ต้องมี path ก่อน
 *
 * type:
 *    - item : รายการเดี่ยว
 *          - จะใช้ title, key ของ path มาเป็นตัวเลือก
 *    - group : กลุ่ม
 *          - ขำเป็นต้องมี title มาเป็นชื่อกลุ่ม
 *          - จำเป็นต้องมี key ไม่ซ้ำกัน
 *          - title ของ item จะใช้ title ของ path
 *          - key ของ item จะใช้ key ของ path และ group key merge กัน
 */

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
    ],
  },
  {
    type: "group",
    key: "store",
    title: "ร้านค้า",
    items: [
      { path: Path("promotions") },
      { path: Path("histories") },

      { path: Path("roles") },
      { path: Path("employees") },
    ],
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
