import { GlobalPermissionEnum, StorePermissionEnum } from "@/enums/permission";

/**
 * Centralized Permission Configuration
 *
 * This configuration maps all actions in the application to their required permissions.
 * It serves as a single source of truth for permission requirements.
 *
 * Usage:
 * ```typescript
 * import { PermissionConfig } from "@/config/permissionConfig";
 * assertStoreCan(ctx, PermissionConfig.store.product.create);
 * ```
 */
export const PermissionConfig = {
  /**
   * Global-level permissions (not tied to a specific store)
   */
  global: {
    /** Create a new store */
    createStore: GlobalPermissionEnum.STORE_CREATE,
  },

  /**
   * Store-level permissions (tied to a specific store)
   */
  store: {
    /** Dashboard operations */
    dashboard: {
      /** Get preorder summary */
      viewOrderSoldStat: StorePermissionEnum.HISTORY_READ_ALL,
      /** View consignment summary */
      viewConsignmentStat: StorePermissionEnum.CONSIGNMENT_MANAGEMENT,
      /** View preorder summary */
      viewPreorderStat: StorePermissionEnum.PREORDER_MANAGEMENT,
      /** View lowstock summary */
      viewLowstockStat: StorePermissionEnum.PRODUCT_MANAGEMENT,
    },

    /** Cashier operations */
    cashier: {
      /** Perform cashout operation */
      cashout: StorePermissionEnum.CASHIER_CASHOUT,
      /** Get related promotion offer */
      getRelatedPromotionOffer: StorePermissionEnum.CASHIER_CASHOUT,
      /** Get obtain promotion offer */
      getObtainPromotionOffer: StorePermissionEnum.CASHIER_CASHOUT,
      /** Get product for cashier */
      getProductCashier: StorePermissionEnum.CASHIER_CASHOUT,
    },

    /** Product management operations */
    product: {
      /** Get product datatable */
      getDatatable: StorePermissionEnum.PRODUCT_MANAGEMENT,
      /** Get product details */
      getDetail: StorePermissionEnum.PRODUCT_MANAGEMENT,
      /** Create a new product */
      create: StorePermissionEnum.PRODUCT_MANAGEMENT,
      /** Update existing product */
      update: StorePermissionEnum.PRODUCT_MANAGEMENT,
      /** Delete a product */
      delete: StorePermissionEnum.PRODUCT_MANAGEMENT,
      /** Recover deleted product */
      recovery: StorePermissionEnum.PRODUCT_MANAGEMENT,
      /** Update product stock alert settings */
      updateStockAlert: StorePermissionEnum.PRODUCT_MANAGEMENT,
      /** Update product preorder settings */
      updatePreorder: StorePermissionEnum.PRODUCT_MANAGEMENT,
      /** Adjust product stock */
      adjustStock: StorePermissionEnum.PRODUCT_MANAGEMENT,
      /** Find product for creation/reference */
      find: StorePermissionEnum.PRODUCT_MANAGEMENT,
    },

    /** Stock/Inventory management operations */
    stock: {
      /** Create stock receipt */
      createReceipt: StorePermissionEnum.PRODUCT_MANAGEMENT,
      /** Cancel stock receipt */
      cancelReceipt: StorePermissionEnum.PRODUCT_MANAGEMENT,
      /** Update stock levels */
      update: StorePermissionEnum.PRODUCT_MANAGEMENT,
      /** Get stock receipt datatable */
      getReceiptDatatable: StorePermissionEnum.PRODUCT_MANAGEMENT,
      /** Export stock receipt data */
      exportReceipt: StorePermissionEnum.PRODUCT_MANAGEMENT,
      /** Stock management tools/utilities */
      tools: StorePermissionEnum.PRODUCT_MANAGEMENT,
    },

    /** Consignment management operations */
    consignment: {
      /** Create consignment */
      create: StorePermissionEnum.CONSIGNMENT_MANAGEMENT,
      /** Update consignment */
      update: StorePermissionEnum.CONSIGNMENT_MANAGEMENT,
      /** Mark consignment as sold */
      updateSold: StorePermissionEnum.CONSIGNMENT_MANAGEMENT,
      /** Get consignment details */
      get: StorePermissionEnum.CONSIGNMENT_MANAGEMENT,
      /** Fetch consignment datatable */
      fetchDatatable: StorePermissionEnum.CONSIGNMENT_MANAGEMENT,
    },

    /** Preorder management operations */
    preorder: {
      /** Get preorder details */
      getDetail: StorePermissionEnum.PREORDER_MANAGEMENT,
      /** Get preorders datatable */
      getDatatable: StorePermissionEnum.PREORDER_MANAGEMENT,
      /** Update preorder status */
      updateStatus: StorePermissionEnum.PREORDER_MANAGEMENT,
    },

    /** Promotion management operations */
    promotion: {
      /** Create promotion offer */
      createOffer: StorePermissionEnum.PROMOTION_MANAGEMENT,
      /** Update promotion offer */
      updateOffer: StorePermissionEnum.PROMOTION_MANAGEMENT,
      /** Disable promotion offer */
      disableOffer: StorePermissionEnum.PROMOTION_MANAGEMENT,
      /** Get promotion datatable */
      getDatatable: StorePermissionEnum.PROMOTION_MANAGEMENT,
      /** Get promotion details */
      getDetail: StorePermissionEnum.PROMOTION_MANAGEMENT,
    },

    /** Broadcast management operations */
    broadcast: {
      /** Create broadcast */
      create: StorePermissionEnum.BROADCAST_MANAGEMENT,
      /** Update broadcast */
      update: StorePermissionEnum.BROADCAST_MANAGEMENT,
      /** Delete broadcast */
      delete: StorePermissionEnum.BROADCAST_MANAGEMENT,
      /** Cancel broadcast */
      cancel: StorePermissionEnum.BROADCAST_MANAGEMENT,
      /** Send broadcast */
      send: StorePermissionEnum.BROADCAST_MANAGEMENT,
      /** Get broadcast details */
      get: StorePermissionEnum.BROADCAST_MANAGEMENT,
      /** Fetch broadcast datatable */
      fetchDatatable: StorePermissionEnum.BROADCAST_MANAGEMENT,
      /** Search/manage events for broadcasts */
      manageEvents: StorePermissionEnum.BROADCAST_MANAGEMENT,
      /** Generate broadcast content with AI */
      generateContent: StorePermissionEnum.BROADCAST_MANAGEMENT,
    },

    /** Application management operations (LINE, etc.) */
    application: {
      /** Get LINE applications */
      getLineApplications: StorePermissionEnum.APPLICATION_MANAGEMENT,
      /** Create LINE application */
      createLineApplication: StorePermissionEnum.APPLICATION_MANAGEMENT,
      /** Update LINE application */
      updateLineApplication: StorePermissionEnum.APPLICATION_MANAGEMENT,
    },

    /** Employee management operations */
    employee: {
      /** Create employee */
      create: StorePermissionEnum.EMPLOYEE_MANAGEMENT,
      /** Update employee */
      update: StorePermissionEnum.EMPLOYEE_MANAGEMENT,
      /** Delete employee */
      delete: StorePermissionEnum.EMPLOYEE_MANAGEMENT,
      /** Get employee details */
      get: StorePermissionEnum.EMPLOYEE_MANAGEMENT,
    },

    /** Category management operations */
    category: {
      /** Get category datatable */
      getDatatable: StorePermissionEnum.PRODUCT_MANAGEMENT,
      /** Create/update category */
      upsert: StorePermissionEnum.PRODUCT_MANAGEMENT,
      /** Delete category */
      delete: StorePermissionEnum.PRODUCT_MANAGEMENT,
      /** Select/list categories */
      select: StorePermissionEnum.PRODUCT_MANAGEMENT,
    },

    /** Order/History operations */
    history: {
      /** Get all order products */
      getAllOrderProducts: StorePermissionEnum.HISTORY_READ_ALL,
      /** Get order products for specific order */
      getOrderProducts: StorePermissionEnum.HISTORY_READ_ALL,
      /** Get preorder products */
      getOrderPreOrderProducts: StorePermissionEnum.HISTORY_READ_ALL,
      /** Get history detail */
      getDetail: StorePermissionEnum.HISTORY_READ_ALL,
      /** Get history datatable */
      getDatatable: StorePermissionEnum.HISTORY_READ_ALL,
      /** Get history creators */
      getCreators: StorePermissionEnum.HISTORY_READ_ALL,
      /** Read all user orders */
      readAllUser: StorePermissionEnum.HISTORY_READ_ALL,
    },
  },
} as const;

/**
 * Type-safe helper to get permission for a store action
 *
 * @example
 * ```typescript
 * const permission = getStorePermission("product", "create");
 * assertStoreCan(ctx, permission);
 * ```
 */
export function getStorePermission<
  TModule extends keyof typeof PermissionConfig.store,
  TAction extends keyof (typeof PermissionConfig.store)[TModule],
>(module: TModule, action: TAction): StorePermissionEnum {
  return PermissionConfig.store[module][action] as StorePermissionEnum;
}

/**
 * Type-safe helper to get permission for a global action
 *
 * @example
 * ```typescript
 * const permission = getGlobalPermission("createStore");
 * assertGlobalCan(ctx, permission);
 * ```
 */
export function getGlobalPermission<
  TAction extends keyof typeof PermissionConfig.global,
>(action: TAction): GlobalPermissionEnum {
  return PermissionConfig.global[action];
}

/**
 * Get all permissions for a specific module
 *
 * @example
 * ```typescript
 * const productPermissions = getModulePermissions("product");
 * // Returns all permissions needed for product management
 * ```
 */
export function getModulePermissions<
  TModule extends keyof typeof PermissionConfig.store,
>(module: TModule): StorePermissionEnum[] {
  const moduleConfig = PermissionConfig.store[module];
  return Array.from(
    new Set(Object.values(moduleConfig) as StorePermissionEnum[]),
  );
}

/**
 * Type definitions for better autocomplete
 */
export type StoreModule = keyof typeof PermissionConfig.store;
export type StoreAction<TModule extends StoreModule> =
  keyof (typeof PermissionConfig.store)[TModule];
export type GlobalAction = keyof typeof PermissionConfig.global;
