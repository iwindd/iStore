import { PermissionEnum } from "@/enums/permission";
import { GroupedPermissionBit } from "./Permission";
import icons from "./Icons";

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
  ["cashier"]: {
    key: "cashier",
    title: "ขายสินค้า",
    href: "/cashier",
    icon: "cashier",
    somePermissions: GroupedPermissionBit.cashier,
  },
  ["products"]: {
    key: "products",
    title: "สินค้า",
    href: "/products",
    icon: "product",
    somePermissions: GroupedPermissionBit.product,
  },
  ["categories"]: {
    key: "categories",
    title: "ประเภทสินค้า",
    href: "/categories",
    icon: "category",
    somePermissions: GroupedPermissionBit.category,
  },
  ["stock"]: {
    key: "stock",
    title: "จัดการสต๊อก",
    href: "/stocks",
    icon: "stock",
    somePermissions: GroupedPermissionBit.stock,
  },
  ["overstocks"]: {
    key: "overstocks",
    title: "สินค้าค้าง",
    href: "/overstocks",
    icon: "overstocks",
    somePermissions: GroupedPermissionBit.overstock,
  },
  ["borrows"]: {
    key: "borrows",
    title: "การเบิก",
    href: "/borrows",
    icon: "borrows",
    somePermissions: GroupedPermissionBit.borrow,
  },
  ["purchase"]: {
    key: "purchase",
    title: "ซื้อสินค้า",
    href: "/purchase",
    icon: "purchase",
    matcher: { type: "startsWith", href: "/purchase" },
    somePermissions: GroupedPermissionBit.purchase,
  },
  ["purchase.purchase"]: {
    key: "purchase",
    title: "รายละเอียดการซื้อสินค้า",
    href: "/purchase/:pid",
    icon: "purchase",
    somePermissions: GroupedPermissionBit.purchase,
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
    somePermissions: GroupedPermissionBit.role,
  },
  ["employees"]: {
    key: "employees",
    title: "พนักงาน",
    href: "/employees",
    icon: "employee",
    somePermissions: GroupedPermissionBit.employee,
  },
} satisfies Record<string, PathType>;

export const HomePath = Paths.overview.href;
export const Path = (name: keyof typeof Paths) => Paths[name];
export default Paths;
