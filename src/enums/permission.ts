export enum SuperPermissionEnum {
  ALL = "*",
  DASHBOARD = "DASHBOARD.*",
  CASHIER = "CASHIER.*",
  PRODUCT = "PRODUCT.*",
  CATEGORY = "CATEGORY.*",
  STOCK = "STOCK.*",
  OVERSTOCK = "OVERSTOCK.*",
  BORROW = "BORROW.*",
  PURCHASE = "PURCHASE.*",
  HISTORY = "HISTORY.*",
  ACCOUNT = "ACCOUNT.*",
  ROLE = "ROLE.*",
}

export enum DashboardPermissionEnum {
  ALL = SuperPermissionEnum.DASHBOARD,
  READ = "DASHBOARD.READ",
}

export enum CashierPermissionEnum {
  ALL = SuperPermissionEnum.CASHIER,
  CREATE = "CASHIER.CREATE",
}

export enum ProductPermissionEnum {
  ALL = SuperPermissionEnum.PRODUCT,
  READ = "PRODUCT.READ",
  CREATE = "PRODUCT.CREATE",
  UPDATE = "PRODUCT.UPDATE",
  DELETE = "PRODUCT.DELETE",
}

export enum CategoryPermissionEnum {
  ALL = SuperPermissionEnum.CATEGORY,
  READ = "CATEGORY.READ",
  CREATE = "CATEGORY.CREATE",
  UPDATE = "CATEGORY.UPDATE",
  DELETE = "CATEGORY.DELETE",
}

export enum StockPermissionEnum {
  ALL = SuperPermissionEnum.STOCK,
  READ = "STOCK.READ",
  CREATE = "STOCK.CREATE",
  UPDATE = "STOCK.UPDATE",
  DELETE = "STOCK.DELETE",
}

export enum OverStockPermissionEnum {
  ALL = SuperPermissionEnum.OVERSTOCK,
  READ = "OVERSTOCK.READ",
  UPDATE = "OVERSTOCK.UPDATE",
}

export enum BorrowPermissionEnum {
  ALL = SuperPermissionEnum.BORROW,
  READ = "BORROW.READ",
  CREATE = "BORROW.CREATE",
  UPDATE = "BORROW.UPDATE",
  DELETE = "BORROW.DELETE",
}

export enum PurchasePermissionEnum {
  ALL = SuperPermissionEnum.PURCHASE,
  READ = "PURCHASE.READ",
  CREATE = "PURCHASE.CREATE",
}

export enum HistoryPermissionEnum {
  ALL = SuperPermissionEnum.HISTORY,
  READ = "HISTORY.READ",
}

export enum AccountPermissionEnum {
  ALL = SuperPermissionEnum.ACCOUNT,
  UPDATE = "ACCOUNT.UPDATE",
}

export enum RolePermissionEnum {
  ALL = SuperPermissionEnum.ROLE,
  READ = "ROLE.READ",
  CREATE = "ROLE.CREATE",
  UPDATE = "ROLE.UPDATE",
  DELETE = "ROLE.DELETE",
}

export type PermissionEnum = | 
  ProductPermissionEnum | 
  CategoryPermissionEnum | 
  StockPermissionEnum | 
  OverStockPermissionEnum | 
  BorrowPermissionEnum | 
  PurchasePermissionEnum | 
  HistoryPermissionEnum | 
  AccountPermissionEnum | 
  RolePermissionEnum;

export const PermissionBit = {
  [SuperPermissionEnum.ALL]: 1n << 64n,
  [DashboardPermissionEnum.READ]: 1n << 26n,
  [CashierPermissionEnum.CREATE]: 1n << 27n,

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
};