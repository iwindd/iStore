import {
  BorrowPermissionEnum,
  CashierPermissionEnum,
  CategoryPermissionEnum,
  EmployeePermissionEnum,
  OverStockPermissionEnum,
  PermissionEnum,
  ProductPermissionEnum,
  PurchasePermissionEnum,
  RolePermissionEnum,
  StockPermissionEnum,
} from "@/enums/permission";
import icons from "./Icons";

export interface Path {
  key: string;
  title: string;
  href: string;
  icon: keyof typeof icons;
  disableBreadcrumb?: boolean;
  disableNav?: boolean;
  matcher?: { type: "startsWith" | "equals"; href: string };
  somePermissions?: PermissionEnum[];
}

const Paths = {
  overview: { key: "overview", title: "ภาพรวม", href: "/", icon: "chart-pie" },
  cashier: {
    key: "cashier",
    title: "ขายสินค้า",
    href: "/cashier",
    icon: "cashier",
    somePermissions: [
      CashierPermissionEnum.ALL, 
      CashierPermissionEnum.CREATE
    ],
  },
  products: {
    key: "products",
    title: "สินค้า",
    href: "/products",
    icon: "product",
    somePermissions: [
      ProductPermissionEnum.ALL,
      ProductPermissionEnum.READ,
      ProductPermissionEnum.CREATE,
      ProductPermissionEnum.UPDATE,
      ProductPermissionEnum.DELETE,
    ],
  },
  categories: {
    key: "categories",
    title: "ประเภทสินค้า",
    href: "/categories",
    icon: "category",
    somePermissions: [
      CategoryPermissionEnum.ALL,
      CategoryPermissionEnum.READ,
      CategoryPermissionEnum.CREATE,
      CategoryPermissionEnum.UPDATE,
      CategoryPermissionEnum.DELETE,
    ],
  },
  stock: {
    key: "stock",
    title: "จัดการสต๊อก",
    href: "/stocks",
    icon: "stock",
    somePermissions: [
      StockPermissionEnum.ALL,
      StockPermissionEnum.READ,
      StockPermissionEnum.CREATE,
      StockPermissionEnum.UPDATE,
      StockPermissionEnum.DELETE,
    ],
  },
  overstocks: {
    key: "overstocks",
    title: "สินค้าค้าง",
    href: "/overstocks",
    icon: "overstocks",
    somePermissions: [
      OverStockPermissionEnum.ALL,
      OverStockPermissionEnum.READ,
      OverStockPermissionEnum.UPDATE,
    ],
  },
  borrows: {
    key: "borrows",
    title: "การเบิก",
    href: "/borrows",
    icon: "borrows",
    somePermissions: [
      BorrowPermissionEnum.ALL,
      BorrowPermissionEnum.READ,
      BorrowPermissionEnum.CREATE,
      BorrowPermissionEnum.UPDATE,
      BorrowPermissionEnum.DELETE,
    ],
  },
  purchase: {
    key: "purchase",
    title: "ซื้อสินค้า",
    href: "/purchase",
    icon: "purchase",
    matcher: { type: "startsWith", href: "/purchase" },
    somePermissions: [
      PurchasePermissionEnum.ALL,
      PurchasePermissionEnum.READ,
      PurchasePermissionEnum.CREATE,
    ],
  },
  "purchase.purchase": {
    key: "purchase",
    title: "รายละเอียดการซื้อสินค้า",
    href: "/purchase/:pid",
    icon: "purchase",
    disableNav: true,
    somePermissions: [
      PurchasePermissionEnum.ALL, 
      PurchasePermissionEnum.READ
    ],
  },
  histories: {
    key: "histories",
    title: "ประวัติการขายสินค้า",
    href: "/histories",
    icon: "history",
    matcher: { type: "startsWith", href: "/histories" },
  },
  "histories.history": {
    key: "histories.history",
    title: "รายละเอียดการขายสินค้า",
    href: "/histories/:hid",
    icon: "history",
    disableNav: true,
  },
  signin: {
    key: "signin",
    title: "เข้าสู่ระบบ",
    href: "/auth/signin",
    icon: "signin",
    disableBreadcrumb: true,
    disableNav: true,
  },
  signup: {
    key: "signup",
    title: "ลงทะเบียน",
    href: "/auth/signup",
    icon: "signup",
    disableBreadcrumb: true,
    disableNav: true,
  },
  account: {
    key: "account",
    title: "บัญชี",
    href: "/account",
    icon: "account",
  },
  roles: {
    key: "roles",
    title: "ตำแหน่ง",
    href: "/roles",
    icon: "group",
    somePermissions: [
      RolePermissionEnum.ALL,
      RolePermissionEnum.CREATE,
      RolePermissionEnum.UPDATE,
      RolePermissionEnum.READ,
      RolePermissionEnum.DELETE,
    ],
  },
  employees: {
    key: "employees",
    title: "พนักงาน",
    href: "/employees",
    icon: "employee",
    somePermissions: [
      EmployeePermissionEnum.ALL,
      EmployeePermissionEnum.READ,
      EmployeePermissionEnum.CREATE,
      EmployeePermissionEnum.UPDATE,
      EmployeePermissionEnum.DELETE,
    ],
  },
} satisfies Record<string, Path>;

export const Path = (name: keyof typeof Paths) => Paths[name];
export default Object.values(Paths) as Path[];
