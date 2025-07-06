import { AccountPermissionEnum, CashierPermissionEnum, DashboardPermissionEnum, HistoryPermissionEnum, PermissionEnum, ProductPermissionEnum, SuperPermissionEnum } from "@/enums/permission";

export interface PermissionInstance{
  name: PermissionEnum;
  label: string;
  childOf?: string; 
}

export default [
  { name: SuperPermissionEnum.ALL, label: "ผู้ดูแลระบบ" },
  { name: DashboardPermissionEnum.READ, label: "แดชบอร์ด" },
  { name: CashierPermissionEnum.CREATE, label: "คิดเงิน" },
  { name: HistoryPermissionEnum.READ, label: "ประวัติการทำรายการ" },
  { name: AccountPermissionEnum.UPDATE, label: "แก้ไขบัญชีผู้ใช้" },
  // Product permissions
  { name: ProductPermissionEnum.ALL,    label: "สินค้า" },
  { name: ProductPermissionEnum.READ,   label: "ดูข้อมูลสินค้าทั้งหมด", childOf: ProductPermissionEnum.ALL },
  { name: ProductPermissionEnum.CREATE, label: "เพิ่มสินค้า",         childOf: ProductPermissionEnum.ALL },
  { name: ProductPermissionEnum.UPDATE, label: "แก้ไขสินค้า",        childOf: ProductPermissionEnum.ALL },
  { name: ProductPermissionEnum.DELETE, label: "ลบสินค้า",          childOf: ProductPermissionEnum.ALL },
  // Category permissions
  { name: SuperPermissionEnum.CATEGORY, label: "หมวดหมู่สินค้า" },
  { name: "CATEGORY.READ",   label: "ดูข้อมูลหมวดหมู่ทั้งหมด", childOf: SuperPermissionEnum.CATEGORY },
  { name: "CATEGORY.CREATE", label: "เพิ่มหมวดหมู่",         childOf: SuperPermissionEnum.CATEGORY },
  { name: "CATEGORY.UPDATE", label: "แก้ไขหมวดหมู่",        childOf: SuperPermissionEnum.CATEGORY },
  { name: "CATEGORY.DELETE", label: "ลบหมวดหมู่",          childOf: SuperPermissionEnum.CATEGORY },
  // Stock permissions
  { name: SuperPermissionEnum.STOCK, label: "สต็อกสินค้า" },
  { name: "STOCK.READ",   label: "ดูข้อมูลสต็อกทั้งหมด", childOf: SuperPermissionEnum.STOCK },
  { name: "STOCK.CREATE", label: "เพิ่มสต็อก",         childOf: SuperPermissionEnum.STOCK },
  { name: "STOCK.UPDATE", label: "แก้ไขสต็อก",        childOf: SuperPermissionEnum.STOCK },
  { name: "STOCK.DELETE", label: "ลบสต็อก",          childOf: SuperPermissionEnum.STOCK },
  // OverStock permissions
  { name: SuperPermissionEnum.OVERSTOCK, label: "สต็อกเกิน" },
  { name: "OVERSTOCK.READ",   label: "ดูข้อมูลสต็อกเกินทั้งหมด", childOf: SuperPermissionEnum.OVERSTOCK },
  { name: "OVERSTOCK.UPDATE", label: "แก้ไขสต็อกเกิน",        childOf: SuperPermissionEnum.OVERSTOCK },
  // Borrow permissions
  { name: SuperPermissionEnum.BORROW, label: "ยืมสินค้า" },
  { name: "BORROW.READ",   label: "ดูข้อมูลการยืมทั้งหมด", childOf: SuperPermissionEnum.BORROW },
  { name: "BORROW.CREATE", label: "เพิ่มการยืม",         childOf: SuperPermissionEnum.BORROW },
  { name: "BORROW.UPDATE", label: "แก้ไขการยืม",        childOf: SuperPermissionEnum.BORROW },
  // Purchase permissions
  { name: SuperPermissionEnum.PURCHASE, label: "การสั่งซื้อ" },
  { name: "PURCHASE.READ",   label: "ดูข้อมูลการสั่งซื้อทั้งหมด", childOf: SuperPermissionEnum.PURCHASE },
  { name: "PURCHASE.CREATE", label: "เพิ่มการสั่งซื้อ",         childOf: SuperPermissionEnum.PURCHASE },
  // Role permissions
  { name: SuperPermissionEnum.ROLE, label: "ตำแหน่ง" },
  { name: "ROLE.READ",   label: "ดูข้อมูลตำแหน่งทั้งหมด", childOf: SuperPermissionEnum.ROLE },
  { name: "ROLE.CREATE", label: "เพิ่มตำแหน่ง",         childOf: SuperPermissionEnum.ROLE },
  { name: "ROLE.UPDATE", label: "แก้ไขตำแหน่ง",        childOf: SuperPermissionEnum.ROLE },
  { name: "ROLE.DELETE", label: "ลบตำแหน่ง",          childOf: SuperPermissionEnum.ROLE },
] as PermissionInstance[];
