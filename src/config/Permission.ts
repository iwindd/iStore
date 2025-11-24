import {
  AccountPermissionEnum,
  BorrowPermissionEnum,
  CashierPermissionEnum,
  CategoryPermissionEnum,
  DashboardPermissionEnum,
  EmployeePermissionEnum,
  HistoryPermissionEnum,
  OverStockPermissionEnum,
  PermissionEnum,
  ProductPermissionEnum,
  PromotionPermissionEnum,
  PurchasePermissionEnum,
  RolePermissionEnum,
  StockPermissionEnum,
  StorePermissionEnum,
  SuperPermissionEnum,
} from "@/enums/permission";

const ALL_PERMISSIONS: Record<SuperPermissionEnum, PermissionEnum[]> = {
  [SuperPermissionEnum.ALL]: [], // Will be filled later
  [SuperPermissionEnum.DASHBOARD]: [DashboardPermissionEnum.READ],
  [SuperPermissionEnum.CASHIER]: [CashierPermissionEnum.CREATE],
  [SuperPermissionEnum.PRODUCT]: [
    ProductPermissionEnum.READ,
    ProductPermissionEnum.CREATE,
    ProductPermissionEnum.UPDATE,
    ProductPermissionEnum.DELETE,
  ],
  [SuperPermissionEnum.CATEGORY]: [
    CategoryPermissionEnum.READ,
    CategoryPermissionEnum.CREATE,
    CategoryPermissionEnum.UPDATE,
    CategoryPermissionEnum.DELETE,
  ],
  [SuperPermissionEnum.STOCK]: [
    StockPermissionEnum.READ,
    StockPermissionEnum.CREATE,
    StockPermissionEnum.UPDATE,
    StockPermissionEnum.DELETE,
  ],
  [SuperPermissionEnum.OVERSTOCK]: [
    OverStockPermissionEnum.READ,
    OverStockPermissionEnum.UPDATE,
  ],
  [SuperPermissionEnum.BORROW]: [
    BorrowPermissionEnum.READ,
    BorrowPermissionEnum.CREATE,
    BorrowPermissionEnum.UPDATE,
    BorrowPermissionEnum.DELETE,
  ],
  [SuperPermissionEnum.PURCHASE]: [
    PurchasePermissionEnum.READ,
    PurchasePermissionEnum.CREATE,
  ],
  [SuperPermissionEnum.HISTORY]: [HistoryPermissionEnum.READ],
  [SuperPermissionEnum.ACCOUNT]: [AccountPermissionEnum.UPDATE],
  [SuperPermissionEnum.ROLE]: [
    RolePermissionEnum.READ,
    RolePermissionEnum.CREATE,
    RolePermissionEnum.UPDATE,
    RolePermissionEnum.DELETE,
  ],
  [SuperPermissionEnum.EMPLOYEE]: [
    EmployeePermissionEnum.READ,
    EmployeePermissionEnum.CREATE,
    EmployeePermissionEnum.UPDATE,
    EmployeePermissionEnum.DELETE,
  ],
  [SuperPermissionEnum.STORE]: [
    StorePermissionEnum.READ,
    StorePermissionEnum.CREATE,
    StorePermissionEnum.UPDATE,
    StorePermissionEnum.DELETE,
  ],
  [SuperPermissionEnum.PROMOTION]: [
    PromotionPermissionEnum.READ,
    PromotionPermissionEnum.CREATE,
    PromotionPermissionEnum.UPDATE,
    PromotionPermissionEnum.DELETE,
  ],
};

ALL_PERMISSIONS[SuperPermissionEnum.ALL] =
  Object.values(ALL_PERMISSIONS).flat();

/** @Deprecated use MAPPING_PERMISSION instead */
export const GroupedPermissionBit: Record<string, PermissionEnum[]> =
  ALL_PERMISSIONS;

export const MAPPING_PERMISSION = ALL_PERMISSIONS;

export const getPermissionInGroup = (
  group: SuperPermissionEnum
): PermissionEnum[] => {
  return ALL_PERMISSIONS[group] || [];
};

export const isSuperPermission = (
  permission: PermissionEnum | SuperPermissionEnum
): permission is SuperPermissionEnum => {
  return Object.values(SuperPermissionEnum).includes(
    permission as SuperPermissionEnum
  );
};
