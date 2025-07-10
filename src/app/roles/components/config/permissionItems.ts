import {
  AccountPermissionEnum,
  BorrowPermissionEnum,
  CashierPermissionEnum,
  CategoryPermissionEnum,
  DashboardPermissionEnum,
  HistoryPermissionEnum,
  OverStockPermissionEnum,
  ProductPermissionEnum,
  PurchasePermissionEnum,
  StockPermissionEnum,
  SuperPermissionEnum,
} from "@/enums/permission";
import { TreeViewBaseItem } from "@mui/x-tree-view";

const TreeViewPermissionItems: TreeViewBaseItem[] = [
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
    id: DashboardPermissionEnum.ALL,
    label: "แดชบอร์ดร้านค้า",
    children: [{ id: DashboardPermissionEnum.READ, label: "เข้าถึงข้อมูลแดชบอร์ดทั้งหมด" }],
  },
  {
    id: ProductPermissionEnum.ALL,
    label: "จัดการสินค้า",
    children: [
      { id: ProductPermissionEnum.READ, label: "เข้าถึงสินค้าทั้งหมด" },
      { id: ProductPermissionEnum.CREATE, label: "เพิ่มสินค้า" },
      { id: ProductPermissionEnum.UPDATE, label: "แก้ไขสินค้า" },
      { id: ProductPermissionEnum.DELETE, label: "ลบสินค้า" },
    ],
  },
  {
    id: CategoryPermissionEnum.ALL,
    label: "หมวดหมู่สินค้า",
    children: [
      { id: CategoryPermissionEnum.READ, label: "เข้าถึงหมวดหมู่สินค้าทั้งหมด" },
      { id: CategoryPermissionEnum.CREATE, label: "เพิ่มหมวดหมู่สินค้า" },
      { id: CategoryPermissionEnum.UPDATE, label: "แก้ไขหมวดหมู่สินค้า" },
      { id: CategoryPermissionEnum.DELETE, label: "ลบหมวดหมู่สินค้า" },
    ],
  },
  {
    id: StockPermissionEnum.ALL,
    label: "สต็อกสินค้า",
    children: [
      { id: StockPermissionEnum.READ, label: "เข้าถึงสต็อกสินค้าทั้งหมด" },
      { id: StockPermissionEnum.CREATE, label: "เพิ่มรายการสต็อกสินค้า" },
      { id: StockPermissionEnum.UPDATE, label: "จัดการสต๊อกสินค้า" },
      { id: StockPermissionEnum.DELETE, label: "ยกเลิกสต็อกสินค้า" },
    ],
  },
  {
    id: OverStockPermissionEnum.ALL,
    label: "สินค้าคงค้าง",
    children: [
      { id: OverStockPermissionEnum.READ, label: "ตรวจสอบสินค้าคงค้าง" },
      { id: OverStockPermissionEnum.UPDATE, label: "สำเร็จรายการสินค้าคงค้าง" },
    ],
  },
  {
    id: BorrowPermissionEnum.ALL,
    label: "การเบิกสินค้า",
    children: [
      { id: BorrowPermissionEnum.READ, label: "เข้าถึงการเบิกสินค้าทั้งหมด" },
      { id: BorrowPermissionEnum.CREATE, label: "เพิ่มรายการเบิกสินค้า" },
      { id: BorrowPermissionEnum.UPDATE, label: "คืนการเบิกสินค้า" },
      { id: BorrowPermissionEnum.DELETE, label: "ยกเลิกการเบิกสินค้า" },
    ],
  },
  {
    id: PurchasePermissionEnum.ALL,
    label: "การสั่งซื้อ",
    children: [
      { id: PurchasePermissionEnum.READ, label: "เข้าถึงการสั่งซื้อทั้งหมด" },
      { id: PurchasePermissionEnum.CREATE, label: "เพิ่มรายการสั่งซื้อ" },
    ],
  },
  {
    id: "MANAGER",
    label: "ผู้ดูแลระบบ",
    children: [
      {id: SuperPermissionEnum.ROLE, label: "จัดการตำแหน่ง"},
      {id: SuperPermissionEnum.EMPLOYEE, label: "จัดการพนักงาน"},
      {id: SuperPermissionEnum.STORE, label: "จัดการรายละเอียดร้านค้า"},
    ]
  },
];

export const TreeViewPermissionDefaultItems = [
  CashierPermissionEnum.ALL,
  CashierPermissionEnum.CREATE,
  HistoryPermissionEnum.ALL,
  HistoryPermissionEnum.READ,
  AccountPermissionEnum.ALL,
  AccountPermissionEnum.UPDATE,
]

export default TreeViewPermissionItems;