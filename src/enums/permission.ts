export enum SuperPermissionEnum {
  ALL = "*",
  DASHBOARD = "DASHBOARD.*",
  CASHIER = "CASHIER.*",
  PRODUCT = "PRODUCT.*",
  CATEGORY = "CATEGORY.*",
  STOCK = "STOCK.*",
  OVERSTOCK = "OVERSTOCK.*",
  CONSIGNMENT = "CONSIGNMENT.*",
  PURCHASE = "PURCHASE.*",
  HISTORY = "HISTORY.*",
  ACCOUNT = "ACCOUNT.*",
  ROLE = "ROLE.*",
  EMPLOYEE = "EMPLOYEE.*",
  PROMOTION = "PROMOTION.*",
  STORE = "STORE.*",
}

export enum ProductPermissionEnum {
  ALL = SuperPermissionEnum.PRODUCT,
  READ = "PRODUCT.READ",
  CREATE = "PRODUCT.CREATE",
  UPDATE = "PRODUCT.UPDATE",
  DELETE = "PRODUCT.DELETE",
}

export enum StockPermissionEnum {
  ALL = SuperPermissionEnum.STOCK,
  READ = "STOCK.READ",
  CREATE = "STOCK.CREATE",
  UPDATE = "STOCK.UPDATE",
  DELETE = "STOCK.DELETE",
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

export enum GlobalPermissionEnum {
  STORE_CREATE = "Store.Create",
  USER_MANAGEMENT = "User.Management",
}

export enum StorePermissionEnum {
  CASHIER_CASHOUT = "Cashier.Cashout",
  PRODUCT_MANAGEMENT = "Product.Management",
  CONSIGNMENT_MANAGEMENT = "Consignment.Management",
  PREORDER_MANAGEMENT = "Preorder.Management",
  APPLICATION_MANAGEMENT = "Application.Management",
  PROMOTION_MANAGEMENT = "Promotion.Management",
  EMPLOYEE_MANAGEMENT = "Employee.Management",
  BROADCAST_MANAGEMENT = "Broadcast.Management",
  HISTORY_READ_ALL = "History.ReadAll",
}
