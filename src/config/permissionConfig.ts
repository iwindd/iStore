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

    user: {
      getUsers: GlobalPermissionEnum.USER_MANAGEMENT,
      updateUser: GlobalPermissionEnum.USER_MANAGEMENT,
      updatePassword: GlobalPermissionEnum.USER_MANAGEMENT,
      impersonate: GlobalPermissionEnum.USER_MANAGEMENT,
    },
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
      /** View payment method traffic */
      viewPaymentMethodTraffic: StorePermissionEnum.HISTORY_READ_ALL,
      /** View payment method traffic */
      viewYearlySalesChart: StorePermissionEnum.HISTORY_READ_ALL,
      /** View recent orders */
      viewRecentOrders: StorePermissionEnum.HISTORY_READ_ALL,
      /** View best selling products */
      viewBestSellingProducts: StorePermissionEnum.HISTORY_READ_ALL,
      /** View order report */
      viewOrderReport: StorePermissionEnum.HISTORY_READ_ALL,
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
      create: StorePermissionEnum._DEPRECATED,
      /** Update broadcast */
      update: StorePermissionEnum._DEPRECATED,
      /** Delete broadcast */
      delete: StorePermissionEnum._DEPRECATED,
      /** Cancel broadcast */
      cancel: StorePermissionEnum._DEPRECATED,
      /** Send broadcast */
      send: StorePermissionEnum._DEPRECATED,
      /** Get broadcast details */
      get: StorePermissionEnum._DEPRECATED,
      /** Fetch broadcast datatable */
      fetchDatatable: StorePermissionEnum._DEPRECATED,
      /** Search/manage events for broadcasts */
      manageEvents: StorePermissionEnum._DEPRECATED,
      /** Generate broadcast content with AI */
      generateContent: StorePermissionEnum._DEPRECATED,
    },

    /** Application management operations (LINE, etc.) */
    application: {
      /** Get LINE applications */
      getLineApplications: StorePermissionEnum._DEPRECATED,
      /** Create LINE application */
      createLineApplication: StorePermissionEnum._DEPRECATED,
      /** Update LINE application */
      updateLineApplication: StorePermissionEnum._DEPRECATED,
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
      /** Get employee datatable */
      datatable: StorePermissionEnum.EMPLOYEE_MANAGEMENT,
      getNonEmployeeUsers: StorePermissionEnum.EMPLOYEE_MANAGEMENT,
    },

    /** Role management operations */
    role: {
      /** Create role */
      create: StorePermissionEnum.EMPLOYEE_MANAGEMENT,
      /** Get role datatable */
      datatable: StorePermissionEnum.EMPLOYEE_MANAGEMENT,
      /** Update role */
      update: StorePermissionEnum.EMPLOYEE_MANAGEMENT,
      /** Delete role */
      delete: StorePermissionEnum.EMPLOYEE_MANAGEMENT,
      /** Get role details */
      get: StorePermissionEnum.EMPLOYEE_MANAGEMENT,
      getSelector: StorePermissionEnum.EMPLOYEE_MANAGEMENT,
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
