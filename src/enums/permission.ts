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
  EMPLOYEE = "EMPLOYEE.*",
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

export enum EmployeePermissionEnum {
  ALL = SuperPermissionEnum.EMPLOYEE,
  READ = "EMPLOYEE.READ",
  CREATE = "EMPLOYEE.CREATE",
  UPDATE = "EMPLOYEE.UPDATE",
  DELETE = "EMPLOYEE.DELETE",
}

export type PermissionEnum =
  SuperPermissionEnum |
  CashierPermissionEnum |
  DashboardPermissionEnum |
  ProductPermissionEnum | 
  CategoryPermissionEnum | 
  StockPermissionEnum | 
  OverStockPermissionEnum | 
  BorrowPermissionEnum | 
  PurchasePermissionEnum | 
  HistoryPermissionEnum | 
  AccountPermissionEnum | 
  RolePermissionEnum | 
  EmployeePermissionEnum;