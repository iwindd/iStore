import {
  AccountPermissionEnum,
  CashierPermissionEnum,
  CategoryPermissionEnum,
  ConsignmentPermissionEnum,
  EmployeePermissionEnum,
  HistoryPermissionEnum,
  OverStockPermissionEnum,
  ProductPermissionEnum,
  PromotionPermissionEnum,
  PurchasePermissionEnum,
  RolePermissionEnum,
  StockPermissionEnum,
  StorePermissionEnum,
  SuperPermissionEnum,
} from "@/enums/permission";
import { TreeViewBaseItem } from "@mui/x-tree-view";

/* TODO:: REFACTORING CHILD PERMISSIONS */

const TreeViewPermissionItems: TreeViewBaseItem[] = [
  {
    id: SuperPermissionEnum.ALL,
    label: "ผู้ดูแลระบบ",
  },
  {
    id: CashierPermissionEnum.ALL,
    label: "ขายสินค้า",
    /*     children: [{ id: CashierPermissionEnum.CREATE, label: "ขายสินค้า" }], */
  },
  {
    id: HistoryPermissionEnum.ALL,
    label: "ดูประวัติการทำรายการ",
    /*     children: [
      { id: HistoryPermissionEnum.READ, label: "ดูประวัติการทำรายการ" },
    ], */
  },
  {
    id: AccountPermissionEnum.ALL,
    label: "แก้ไขบัญชี",
    /*     children: [{ id: AccountPermissionEnum.UPDATE, label: "แก้ไขบัญชี" }], */
  },
  /*   {
    id: DashboardPermissionEnum.ALL,
    label: "แดชบอร์ดร้านค้า",
    children: [{ id: DashboardPermissionEnum.READ, label: "เข้าถึงข้อมูลแดชบอร์ดทั้งหมด" }],
  }, */
  {
    id: ProductPermissionEnum.ALL,
    label: "จัดการสินค้า",
    /*     children: [
      { id: ProductPermissionEnum.READ, label: "เข้าถึงสินค้าทั้งหมด" },
      { id: ProductPermissionEnum.CREATE, label: "เพิ่มสินค้า" },
      { id: ProductPermissionEnum.UPDATE, label: "แก้ไขสินค้า" },
      { id: ProductPermissionEnum.DELETE, label: "ลบสินค้า" },
    ], */
  },
  {
    id: CategoryPermissionEnum.ALL,
    label: "หมวดหมู่สินค้า",
    /*     children: [
      {
        id: CategoryPermissionEnum.READ,
        label: "เข้าถึงหมวดหมู่สินค้าทั้งหมด",
      },
      { id: CategoryPermissionEnum.CREATE, label: "เพิ่มหมวดหมู่สินค้า" },
      { id: CategoryPermissionEnum.UPDATE, label: "แก้ไขหมวดหมู่สินค้า" },
      { id: CategoryPermissionEnum.DELETE, label: "ลบหมวดหมู่สินค้า" },
    ], */
  },
  {
    id: StockPermissionEnum.ALL,
    label: "สต็อกสินค้า",
    /*     children: [
      { id: StockPermissionEnum.READ, label: "เข้าถึงสต็อกสินค้าทั้งหมด" },
      { id: StockPermissionEnum.CREATE, label: "เพิ่มรายการสต็อกสินค้า" },
      { id: StockPermissionEnum.UPDATE, label: "จัดการสต๊อกสินค้า" },
      { id: StockPermissionEnum.DELETE, label: "ยกเลิกสต็อกสินค้า" },
    ], */
  },
  {
    id: OverStockPermissionEnum.ALL,
    label: "สินค้าคงค้าง",
    /*     children: [
      { id: OverStockPermissionEnum.READ, label: "ตรวจสอบสินค้าคงค้าง" },
      { id: OverStockPermissionEnum.UPDATE, label: "สำเร็จรายการสินค้าคงค้าง" },
    ], */
  },
  {
    id: ConsignmentPermissionEnum.ALL,
    label: "การฝากขาย",
    /*     children: [
      { id: ConsignmentPermissionEnum.READ, label: "เข้าถึงการฝากขายทั้งหมด" },
      { id: ConsignmentPermissionEnum.CREATE, label: "เพิ่มรายการฝากขาย" },
      { id: ConsignmentPermissionEnum.UPDATE, label: "คืนการฝากขาย" },
      { id: ConsignmentPermissionEnum.DELETE, label: "ยกเลิกการฝากขาย" },
    ], */
  },
  {
    id: PurchasePermissionEnum.ALL,
    label: "การสั่งซื้อ",
    /*     children: [
      { id: PurchasePermissionEnum.READ, label: "เข้าถึงการสั่งซื้อทั้งหมด" },
      { id: PurchasePermissionEnum.CREATE, label: "เพิ่มรายการสั่งซื้อ" },
    ], */
  },
  {
    id: RolePermissionEnum.ALL,
    label: "จัดการตำแหน่ง",
    /*     children: [
      { id: RolePermissionEnum.READ, label: "เข้าถึงตำแหน่งทั้งหมด" },
      { id: RolePermissionEnum.CREATE, label: "เพิ่มตำแหน่ง" },
      { id: RolePermissionEnum.UPDATE, label: "แก้ไขตำแหน่ง" },
      { id: RolePermissionEnum.DELETE, label: "ลบร้านค้า" },
    ], */
  },
  {
    id: EmployeePermissionEnum.ALL,
    label: "จัดการพนักงาน",
    /*     children: [
      { id: EmployeePermissionEnum.READ, label: "เข้าถึงพนักงานทั้งหมด" },
      { id: EmployeePermissionEnum.CREATE, label: "เพิ่มพนักงาน" },
      { id: EmployeePermissionEnum.UPDATE, label: "แก้ไขพนักงาน" },
      { id: EmployeePermissionEnum.DELETE, label: "ลบร้านค้า" },
    ], */
  },
  {
    id: PromotionPermissionEnum.ALL,
    label: "โปรโมชั่น",
    /*     children: [
      { id: PromotionPermissionEnum.READ, label: "เข้าถึงโปรโมชั่นทั้งหมด" },
      { id: PromotionPermissionEnum.CREATE, label: "เพิ่มโปรโมชั่น" },
      { id: PromotionPermissionEnum.UPDATE, label: "แก้ไขโปรโมชั่น" },
      { id: PromotionPermissionEnum.DELETE, label: "ลบร้านค้า" },
    ], */
  },
  {
    id: StorePermissionEnum.ALL,
    label: "จัดการร้านค้า",
    /*     children: [
      { id: StorePermissionEnum.READ, label: "เข้าถึงร้านค้าทั้งหมด" },
      { id: StorePermissionEnum.CREATE, label: "เพิ่มร้านค้า" },
      { id: StorePermissionEnum.UPDATE, label: "แก้ไขร้านค้า" },
      { id: StorePermissionEnum.DELETE, label: "ลบร้านค้า" },
    ], */
  },
];

export const TreeViewPermissionDefaultItems = [
  CashierPermissionEnum.ALL,
  CashierPermissionEnum.CREATE,
  HistoryPermissionEnum.ALL,
  HistoryPermissionEnum.READ,
  AccountPermissionEnum.ALL,
  AccountPermissionEnum.UPDATE,
];

export const treeViewPermissionAllIds = TreeViewPermissionItems.reduce(
  (acc: string[], item) => {
    acc.push(item.id);
    if (item.children) {
      item.children.forEach((child) => acc.push(child.id));
    }
    return acc;
  },
  []
);

export default TreeViewPermissionItems;
