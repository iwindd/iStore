import { PermissionEnum } from "@/enums/permission";
import { Route } from "@/libs/route/route";
import { getRoute } from "@/router";

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

const NavbarItems = [
  getRoute("overview"),
  getRoute("cashier"),
  {
    key: "product",
    title: "สินค้า",
    routes: [getRoute("products"), getRoute("categories"), getRoute("stocks")],
    defaultExpand: true,
  },
  {
    key: "etc",
    title: "อื่นๆ",
    routes: [getRoute("overstocks"), getRoute("borrows"), getRoute("purchase")],
    defaultExpand: true,
  },
  {
    key: "store",
    title: "ร้านค้า",
    routes: [
      getRoute("applications"),
      getRoute("promotions"),
      getRoute("broadcasts"),
      getRoute("histories"),
      getRoute("roles"),
      getRoute("employees"),
      getRoute("store"),
    ],
  },
  {
    key: "account",
    title: "บัญชีของฉัน",
    routes: [getRoute("account")],
  },
] as const satisfies NavbarItem[];

export type NavbarItem = (
  | Route
  | {
      key: string;
      title: string;
      routes: Route[];
      defaultExpand?: boolean;
    }
) & {
  needSomePermissions?: PermissionEnum[];
};

export default NavbarItems;
