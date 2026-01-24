import {
  AllInbox,
  Badge,
  Campaign,
  Category,
  Group,
  History,
  LocalOffer,
  Login,
  Person,
  RotateRight,
  Settings,
  SettingsApplications,
  ShoppingCart,
  Store,
  Work,
} from "@mui/icons-material";
import { buildRouteUtility, ROUTER } from "./libs/route/route";

const ROUTES = ROUTER({
  store: {
    path: "/:store",
    label: "overview.label",
    children: {
      dashboard: {
        path: "/:store/dashboard",
        label: "dashboard.label",
        icon: Store,
        disabledBreadcrumb: true,
        children: {
          report: {
            path: "/:store/dashboard/report",
            label: "dashboard.report.label",
          },
        },
      },
      cashier: {
        path: "/:store/cashier",
        label: "cashier.label",
        icon: ShoppingCart,
      },
      products: {
        path: "/:store/products",
        label: "products.label",
        icon: Work,
        children: {
          product: {
            path: "/:store/products/:id",
            label: "products.product.label",
            children: {
              information: {
                path: "/:store/products/:id/information",
                label: "products.product.information.label",
              },
              stock: {
                path: "/:store/products/:id/stock",
                label: "products.product.stock.label",
              },
              history: {
                path: "/:store/products/:id/history",
                label: "products.product.history.label",
              },
            },
          },
        },
      },
      categories: {
        path: "/:store/categories",
        label: "categories.label",
        icon: Category,
      },
      stocks: {
        path: "/:store/stocks",
        label: "stocks.label",
        icon: AllInbox,
        children: {
          create: {
            path: "/:store/stocks/create",
            label: "stocks.create.label",
          },
          stock: {
            path: "/:store/stocks/:id",
            label: "stocks.stock.label",
          },
        },
      },
      histories: {
        path: "/:store/histories",
        label: "histories.label",
        icon: History,
        children: {
          history: {
            path: "/:store/histories/:id",
            label: "histories.history.label",
          },
        },
      },
      roles: {
        path: "/:store/roles",
        label: "roles.label",
        icon: Badge,
      },
      employees: {
        path: "/:store/employees",
        label: "employees.label",
        icon: Group,
      },
      store: {
        path: "/:store/store",
        label: "store.label",
        icon: Settings,
      },
      broadcasts: {
        path: "/:store/broadcasts",
        label: "broadcasts.label",
        icon: Campaign,
        children: {
          broadcast: {
            path: "/:store/broadcasts/:id",
            label: "broadcasts.broadcast.label",
          },
          create: {
            path: "/:store/broadcasts/new",
            label: "broadcasts.create.label",
          },
        },
      },
      promotions: {
        path: "/:store/promotions",
        label: "promotions.label",
        icon: LocalOffer,
        children: {
          create: {
            path: "/:store/promotions/create",
            label: "promotions.create.label",
            disabledBreadcrumb: true,
            children: {
              buyXgetY: {
                path: "/:store/promotions/create/buyXgetY",
                label: "promotions.create.buyXgetY.label",
              },
            },
          },
          buyXgetY: {
            path: "/:store/promotions/buyXgetY/:id",
            label: "promotions.buyXgetY.label",
          },
        },
      },
      applications: {
        path: "/:store/applications",
        label: "applications.label",
        icon: SettingsApplications,
        children: {
          line: {
            path: "/:store/applications/line/:id",
            label: "applications.line.label",
            children: {
              create: {
                path: "/:store/applications/line/create",
                label: "applications.create.label",
                disabledBreadcrumb: true,
              },
            },
          },
        },
      },
      preorders: {
        path: "/:store/preorders",
        label: "preorders.label",
        icon: RotateRight,
      },
      consignments: {
        path: "/:store/consignments",
        label: "consignments.label",
        icon: AllInbox,
        children: {
          consignment: {
            path: "/:store/consignments/:id",
            label: "consignments.consignment.label",
          },
        },
      },
      //account
      account: {
        path: "/:store/account",
        label: "account.label",
        icon: Person,
      },
    },
  },
  overview: {
    path: "/",
    label: "overview.label",
    icon: Store,
    disabledBreadcrumb: true,
    children: {
      //account
      account: {
        path: "/account",
        label: "account.label",
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
