import {
  AllInbox,
  Badge,
  Campaign,
  Category,
  Dashboard,
  Group,
  History,
  LocalOffer,
  Login,
  Person,
  RotateRight,
  SettingsApplications,
  ShoppingCart,
  Store,
  Work,
} from "@mui/icons-material";
import { StorePermissionEnum } from "./enums/permission";
import { buildRouteUtility, ROUTER } from "./libs/route/route";

const ROUTES = ROUTER({
  projects: {
    path: "/projects",
    label: "store.label",
    icon: Store,
    disabledBreadcrumb: true,
    children: {
      store: {
        path: "/projects/:store",
        label: "store.label",
        disabledBreadcrumb: true,
        children: {
          dashboard: {
            path: "/projects/:store/dashboard",
            label: "store.dashboard.label",
            icon: Store,
            children: {
              report: {
                path: "/projects/:store/dashboard/report",
                label: "store.dashboard.report.label",
              },
            },
          },
          cashier: {
            path: "/projects/:store/cashier",
            label: "store.cashier.label",
            icon: ShoppingCart,
            permission: {
              someStore: [StorePermissionEnum.CASHIER_CASHOUT],
            },
          },
          products: {
            path: "/projects/:store/products",
            label: "store.products.label",
            icon: Work,
            permission: {
              someStore: [StorePermissionEnum.PRODUCT_MANAGEMENT],
            },
            children: {
              product: {
                path: "/projects/:store/products/:id",
                label: "store.products.product.label",
                children: {
                  information: {
                    path: "/projects/:store/products/:id/information",
                    label: "store.products.product.information.label",
                  },
                  stock: {
                    path: "/projects/:store/products/:id/stock",
                    label: "store.products.product.stock.label",
                  },
                  history: {
                    path: "/projects/:store/products/:id/history",
                    label: "store.products.product.history.label",
                  },
                },
              },
            },
          },
          categories: {
            path: "/projects/:store/categories",
            label: "store.categories.label",
            icon: Category,
            permission: {
              someStore: [StorePermissionEnum.PRODUCT_MANAGEMENT],
            },
          },
          stocks: {
            path: "/projects/:store/stocks",
            label: "store.stocks.label",
            icon: AllInbox,
            permission: {
              someStore: [StorePermissionEnum.PRODUCT_MANAGEMENT],
            },
            children: {
              create: {
                path: "/projects/:store/stocks/create",
                label: "store.stocks.create.label",
              },
              stock: {
                path: "/projects/:store/stocks/:id",
                label: "store.stocks.stock.label",
              },
            },
          },
          histories: {
            path: "/projects/:store/histories",
            label: "store.histories.label",
            icon: History,
            children: {
              history: {
                path: "/projects/:store/histories/:id",
                label: "store.histories.history.label",
              },
            },
          },
          roles: {
            path: "/projects/:store/roles",
            label: "store.roles.label",
            icon: Badge,
            permission: {
              someStore: [StorePermissionEnum.EMPLOYEE_MANAGEMENT],
            },
            children: {
              create: {
                path: "/projects/:store/roles/new",
                label: "store.roles.create.label",
              },
              role: {
                path: "/projects/:store/roles/:roleId",
                label: "store.roles.role.label",
              },
            },
          },
          employees: {
            path: "/projects/:store/employees",
            label: "store.employees.label",
            icon: Group,
            permission: {
              someStore: [StorePermissionEnum.EMPLOYEE_MANAGEMENT],
            },
          },
          broadcasts: {
            path: "/projects/:store/broadcasts",
            label: "store.broadcasts.label",
            icon: Campaign,
            permission: {
              someStore: [StorePermissionEnum.BROADCAST_MANAGEMENT],
            },
            children: {
              broadcast: {
                path: "/projects/:store/broadcasts/:id",
                label: "store.broadcasts.broadcast.label",
              },
              create: {
                path: "/projects/:store/broadcasts/new",
                label: "store.broadcasts.create.label",
              },
            },
          },
          promotions: {
            path: "/projects/:store/promotions",
            label: "store.promotions.label",
            icon: LocalOffer,
            permission: {
              someStore: [StorePermissionEnum.PROMOTION_MANAGEMENT],
            },
            children: {
              create: {
                path: "/projects/:store/promotions/create",
                label: "store.promotions.create.label",
                disabledBreadcrumb: true,
                children: {
                  buyXgetY: {
                    path: "/projects/:store/promotions/create/buyXgetY",
                    label: "store.promotions.create.buyXgetY.label",
                  },
                },
              },
              buyXgetY: {
                path: "/projects/:store/promotions/buyXgetY/:id",
                label: "store.promotions.buyXgetY.label",
              },
            },
          },
          applications: {
            path: "/projects/:store/applications",
            label: "store.applications.label",
            icon: SettingsApplications,
            permission: {
              someStore: [StorePermissionEnum.APPLICATION_MANAGEMENT],
            },
            children: {
              line: {
                path: "/projects/:store/applications/line/:id",
                label: "store.applications.line.label",
                children: {
                  create: {
                    path: "/projects/:store/applications/line/create",
                    label: "store.applications.create.label",
                    disabledBreadcrumb: true,
                  },
                },
              },
            },
          },
          preorders: {
            path: "/projects/:store/preorders",
            label: "store.preorders.label",
            icon: RotateRight,
            permission: {
              someStore: [StorePermissionEnum.PREORDER_MANAGEMENT],
            },
          },
          consignments: {
            path: "/projects/:store/consignments",
            label: "store.consignments.label",
            icon: AllInbox,
            permission: {
              someStore: [StorePermissionEnum.CONSIGNMENT_MANAGEMENT],
            },
            children: {
              consignment: {
                path: "/projects/:store/consignments/:id",
                label: "store.consignments.consignment.label",
              },
            },
          },
          //account
          account: {
            path: "/projects/:store/account",
            label: "store.account.label",
            icon: Person,
          },
        },
      },
    },
  },
  overview: {
    path: "/",
    label: "overview.label",
    icon: Dashboard,
    disabledBreadcrumb: true,
    children: {
      new: {
        path: "/projects/new",
        label: "overview.new.label",
      },
      //account
      account: {
        path: "/account",
        label: "store.account.label",
        icon: Person,
      },
    },
  },
  auth: {
    path: "/auth",
    label: "auth.label",
    icon: Login,
    children: {
      signin: {
        path: "/auth/signin",
        label: "auth.signin.label",
        icon: Login,
      },
    },
  },
});

export const {
  getRoute,
  getPath,
  getParamsFromPath,
  findRouteTrail,
  findActiveRoute,
} = buildRouteUtility(ROUTES);
