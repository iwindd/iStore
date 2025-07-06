import {
  AccountPermissionEnum,
  BorrowPermissionEnum,
  CashierPermissionEnum,
  CategoryPermissionEnum,
  DashboardPermissionEnum,
  EmployeePermissionEnum,
  HistoryPermissionEnum,
  OverStockPermissionEnum,
  ProductPermissionEnum,
  PurchasePermissionEnum,
  RolePermissionEnum,
  StockPermissionEnum,
} from "@/enums/permission";
import { TreeViewBaseItem } from "@mui/x-tree-view";

const TreeViewPermissionItems: TreeViewBaseItem[] = [
  {
    id: DashboardPermissionEnum.ALL,
    label: "แดชบอร์ด",
    children: [{ id: DashboardPermissionEnum.READ, label: "ตรวจสอบ" }],
  },
  {
    id: CashierPermissionEnum.ALL,
    label: "แคชเชียร์",
    children: [{ id: CashierPermissionEnum.CREATE, label: "ขายสินค้า" }],
  },
  {
    id: HistoryPermissionEnum.ALL,
    label: "ประวัติการทำรายการ",
    children: [
      { id: HistoryPermissionEnum.READ, label: "ดูประวัติการทำรายการ" },
    ],
  },
  {
    id: AccountPermissionEnum.ALL,
    label: "บัญชี",
    children: [
      { id: AccountPermissionEnum.UPDATE, label: "แก้ไขบัญชี" },
    ],
  },
  {
    id: ProductPermissionEnum.ALL,
    label: "จัดการสินค้า",
    children: [
      { id: ProductPermissionEnum.READ, label: "ตรวจสอบสินค้า" },
      { id: ProductPermissionEnum.CREATE, label: "เพิ่มสินค้า" },
      { id: ProductPermissionEnum.UPDATE, label: "แก้ไขสินค้า" },
      { id: ProductPermissionEnum.DELETE, label: "ลบสินค้า" },
    ],
  },
  {
    id: CategoryPermissionEnum.ALL,
    label: "หมวดหมู่สินค้า",
    children: [
      { id: CategoryPermissionEnum.READ, label: "ตรวจสอบหมวดหมู่สินค้า" },
      { id: CategoryPermissionEnum.CREATE, label: "เพิ่มหมวดหมู่สินค้า" },
      { id: CategoryPermissionEnum.UPDATE, label: "แก้ไขหมวดหมู่สินค้า" },
      { id: CategoryPermissionEnum.DELETE, label: "ลบหมวดหมู่สินค้า" },
    ],
  },
  {
    id: StockPermissionEnum.ALL,
    label: "สต็อกสินค้า",
    children: [
      { id: StockPermissionEnum.READ, label: "ตรวจสอบสต็อกสินค้า" },
      { id: StockPermissionEnum.CREATE, label: "เพิ่มสต็อกสินค้า" },
      { id: StockPermissionEnum.UPDATE, label: "แก้ไขสต็อกสินค้า" },
      { id: StockPermissionEnum.DELETE, label: "ลบสต็อกสินค้า" },
    ],
  },
  {
    id: OverStockPermissionEnum.ALL,
    label: "สินค้าคงค้าง",
    children: [
      { id: OverStockPermissionEnum.READ, label: "ตรวจสอบสต็อกสินค้า" },
      { id: OverStockPermissionEnum.UPDATE, label: "แก้ไขสต็อกสินค้า" },
    ],
  },
  {
    id: BorrowPermissionEnum.ALL,
    label: "ยืมสินค้า",
    children: [
      { id: BorrowPermissionEnum.READ, label: "ตรวจสอบการยืมสินค้า" },
      { id: BorrowPermissionEnum.CREATE, label: "เพิ่มการยืมสินค้า" },
      { id: BorrowPermissionEnum.UPDATE, label: "แก้ไขการยืมสินค้า" },
      { id: BorrowPermissionEnum.DELETE, label: "ลบการยืมสินค้า" },
    ],
  },
  {
    id: PurchasePermissionEnum.ALL,
    label: "การสั่งซื้อ",
    children: [
      { id: PurchasePermissionEnum.READ, label: "ตรวจสอบการสั่งซื้อ" },
      { id: PurchasePermissionEnum.CREATE, label: "เพิ่มการสั่งซื้อ" },
    ],
  },
  {
    id: RolePermissionEnum.ALL,
    label: "ตำแหน่ง",
    children: [
      { id: RolePermissionEnum.READ, label: "ตรวจสอบตำแหน่ง" },
      { id: RolePermissionEnum.CREATE, label: "เพิ่มตำแหน่ง" },
      { id: RolePermissionEnum.UPDATE, label: "แก้ไขตำแหน่ง" },
      { id: RolePermissionEnum.DELETE, label: "ลบตำแหน่ง" },
    ],
  },
  {
    id: EmployeePermissionEnum.ALL,
    label: "พนักงาน",
    children: [
      { id: EmployeePermissionEnum.READ, label: "ตรวจสอบพนักงาน" },
      { id: EmployeePermissionEnum.CREATE, label: "เพิ่มพนักงาน" },
      { id: EmployeePermissionEnum.UPDATE, label: "แก้ไขพนักงาน" },
      { id: EmployeePermissionEnum.DELETE, label: "ลบพนักงาน" },
    ],
  },
];

export const TreeViewPermissionDefaultItems = [
  DashboardPermissionEnum.ALL,
  DashboardPermissionEnum.READ,
  CashierPermissionEnum.ALL,
  CashierPermissionEnum.CREATE,
  HistoryPermissionEnum.ALL,
  HistoryPermissionEnum.READ,
  AccountPermissionEnum.ALL,
  AccountPermissionEnum.UPDATE,
]

export default TreeViewPermissionItems;