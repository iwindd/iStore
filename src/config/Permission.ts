import { AccountPermissionEnum, BorrowPermissionEnum, CashierPermissionEnum, CategoryPermissionEnum, DashboardPermissionEnum, EmployeePermissionEnum, HistoryPermissionEnum, OverStockPermissionEnum, ProductPermissionEnum, PurchasePermissionEnum, RolePermissionEnum, StockPermissionEnum, SuperPermissionEnum } from "@/enums/permission";

export const PermissionBit = {
  [SuperPermissionEnum.ALL]: (1n << 64n) - 1n ,

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
