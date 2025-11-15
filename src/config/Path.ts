import { PermissionEnum, SuperPermissionEnum } from "@/enums/permission";
import icons from "./Icons";
import { getPermissionInGroup } from "./Permission";

export interface PathType {
  key: string;
  title: string;
  href: string;
  icon: keyof typeof icons;
  disableBreadcrumb?: boolean;
  matcher?: { type: "startsWith" | "equals"; href: string };
  somePermissions?: PermissionEnum[];
}

const Paths = {
  ["overview"]: {
    key: "overview",
    title: "ภาพรวม",
    href: "/",
    icon: "chart-pie",
  },
  ["overview.report"]: {
    key: "dashboard/report",
    title: "รายงาน",
    href: "/dashboard/report",
    icon: "report",
  },
  ["cashier"]: {
    key: "cashier",
    title: "ขายสินค้า",
    href: "/cashier",
    icon: "cashier",
    somePermissions: getPermissionInGroup(SuperPermissionEnum.CASHIER),
  },
  ["products"]: {
    key: "products",
    title: "สินค้า",
    href: "/products",
    icon: "product",
    somePermissions: getPermissionInGroup(SuperPermissionEnum.PRODUCT),
  },
  ["categories"]: {
    key: "categories",
    title: "ประเภทสินค้า",
    href: "/categories",
    icon: "category",
    somePermissions: getPermissionInGroup(SuperPermissionEnum.CATEGORY),
  },
  ["stock"]: {
    key: "stock",
    title: "จัดการสต๊อก",
    href: "/stocks",
    icon: "stock",
    somePermissions: getPermissionInGroup(SuperPermissionEnum.STOCK),
  },
  ["overstocks"]: {
    key: "overstocks",
    title: "สินค้าค้าง",
    href: "/overstocks",
    icon: "overstocks",
    somePermissions: getPermissionInGroup(SuperPermissionEnum.OVERSTOCK),
  },
  ["borrows"]: {
    key: "borrows",
    title: "การเบิก",
    href: "/borrows",
    icon: "borrows",
    somePermissions: getPermissionInGroup(SuperPermissionEnum.BORROW),
  },
  ["purchase"]: {
    key: "purchase",
    title: "ซื้อสินค้า",
    href: "/purchase",
    icon: "purchase",
    matcher: { type: "startsWith", href: "/purchase" },
    somePermissions: getPermissionInGroup(SuperPermissionEnum.PURCHASE),
  },
  ["purchase.purchase"]: {
    key: "purchase",
    title: "รายละเอียดการซื้อสินค้า",
    href: "/purchase/:pid",
    icon: "purchase",
    somePermissions: getPermissionInGroup(SuperPermissionEnum.PURCHASE),
  },
  ["histories"]: {
    key: "histories",
    title: "ประวัติการขายสินค้า",
    href: "/histories",
    icon: "history",
    matcher: { type: "startsWith", href: "/histories" },
  },
  ["histories.history"]: {
    key: "histories.history",
    title: "รายละเอียดการขายสินค้า",
    href: "/histories/:hid",
    icon: "history",
  },
  ["signin"]: {
    key: "signin",
    title: "เข้าสู่ระบบ",
    href: "/auth/signin",
    icon: "signin",
    disableBreadcrumb: true,
  },
  ["signup"]: {
    key: "signup",
    title: "ลงทะเบียน",
    href: "/auth/signup",
    icon: "signup",
    disableBreadcrumb: true,
  },
  ["account"]: {
    key: "account",
    title: "บัญชี",
    href: "/account",
    icon: "account",
  },
  ["roles"]: {
    key: "roles",
    title: "ตำแหน่ง",
    href: "/roles",
    icon: "group",
    somePermissions: getPermissionInGroup(SuperPermissionEnum.ROLE),
  },
  ["employees"]: {
    key: "employees",
    title: "พนักงาน",
    href: "/employees",
    icon: "employee",
    somePermissions: getPermissionInGroup(SuperPermissionEnum.EMPLOYEE),
  },
  ["promotions"]: {
    key: "promotions",
    title: "โปรโมชั่น",
    href: "/promotions",
    icon: "promotion",
    matcher: { type: "startsWith", href: "/promotions" },
  },
  ["promotions.create.buyXgetY"]: {
    key: "promotions.create.buyXgetY",
    title: "ซื้อ X แถม Y",
    href: "/promotions/create/buyXgetY",
    icon: "promotion",
  },
} satisfies Record<string, PathType>;

export const HomePath = Paths.overview.href;
export const Path = (name: keyof typeof Paths) => Paths[name];
export default Paths;
