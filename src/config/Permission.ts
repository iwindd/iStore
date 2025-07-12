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
  PurchasePermissionEnum,
  RolePermissionEnum,
  StockPermissionEnum,
  SuperPermissionEnum,
} from "@/enums/permission";

export const PermissionBit = {
  [ProductPermissionEnum.READ]: 1n << 0n,
  [ProductPermissionEnum.CREATE]: 1n << 1n,
  [ProductPermissionEnum.UPDATE]: 1n << 2n,
  [ProductPermissionEnum.DELETE]: 1n << 3n,

  [CategoryPermissionEnum.READ]: 1n << 4n,
  [CategoryPermissionEnum.CREATE]: 1n << 5n,
  [CategoryPermissionEnum.UPDATE]: 1n << 6n,
  [CategoryPermissionEnum.DELETE]: 1n << 7n,

  [StockPermissionEnum.READ]: 1n << 8n,
  [StockPermissionEnum.CREATE]: 1n << 9n,
  [StockPermissionEnum.UPDATE]: 1n << 10n,
  [StockPermissionEnum.DELETE]: 1n << 11n,

  [OverStockPermissionEnum.READ]: 1n << 12n,
  [OverStockPermissionEnum.UPDATE]: 1n << 13n,

  [BorrowPermissionEnum.READ]: 1n << 14n,
  [BorrowPermissionEnum.CREATE]: 1n << 15n,
  [BorrowPermissionEnum.UPDATE]: 1n << 16n,
  [BorrowPermissionEnum.DELETE]: 1n << 17n,

  [PurchasePermissionEnum.READ]: 1n << 18n,
  [PurchasePermissionEnum.CREATE]: 1n << 19n,

  [HistoryPermissionEnum.READ]: 1n << 20n,

  [AccountPermissionEnum.UPDATE]: 1n << 21n,

  [RolePermissionEnum.READ]: 1n << 22n,
  [RolePermissionEnum.CREATE]: 1n << 23n,
  [RolePermissionEnum.UPDATE]: 1n << 24n,
  [RolePermissionEnum.DELETE]: 1n << 25n,

  [DashboardPermissionEnum.READ]: 1n << 26n,
  [CashierPermissionEnum.CREATE]: 1n << 27n,

  [EmployeePermissionEnum.READ]: 1n << 28n,
  [EmployeePermissionEnum.CREATE]: 1n << 29n,
  [EmployeePermissionEnum.UPDATE]: 1n << 30n,
  [EmployeePermissionEnum.DELETE]: 1n << 31n,
};

export const GroupedPermissionBit: Record<string, PermissionEnum[]> = {
  [SuperPermissionEnum.ALL]: Object.keys(
    PermissionBit
  ).filter(p => p != SuperPermissionEnum.ALL) as (keyof typeof PermissionBit)[], // all
  
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
  [SuperPermissionEnum.STORE]: [],
};
