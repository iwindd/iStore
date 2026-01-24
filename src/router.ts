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
  SettingsApplications,
  ShoppingCart,
  Store,
  Work,
} from "@mui/icons-material";
import { buildRouteUtility, ROUTER } from "./libs/route/route";

const ROUTES = ROUTER({
  store: {
    path: "/:store",
    label: "store.label",
    disabledBreadcrumb: true,
    children: {
      dashboard: {
        path: "/:store/dashboard",
        label: "store.dashboard.label",
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
        label: "store.cashier.label",
        icon: ShoppingCart,
      },
      products: {
        path: "/:store/products",
        label: "store.products.label",
        icon: Work,
        children: {
          product: {
            path: "/:store/products/:id",
            label: "store.products.product.label",
            children: {
              information: {
                path: "/:store/products/:id/information",
                label: "store.products.product.information.label",
              },
              stock: {
                path: "/:store/products/:id/stock",
                label: "store.products.product.stock.label",
              },
              history: {
                path: "/:store/products/:id/history",
                label: "store.products.product.history.label",
              },
            },
          },
        },
      },
      categories: {
        path: "/:store/categories",
        label: "store.categories.label",
        icon: Category,
      },
      stocks: {
        path: "/:store/stocks",
        label: "store.stocks.label",
        icon: AllInbox,
        children: {
          create: {
            path: "/:store/stocks/create",
            label: "store.stocks.create.label",
          },
          stock: {
            path: "/:store/stocks/:id",
            label: "store.stocks.stock.label",
          },
        },
      },
      histories: {
        path: "/:store/histories",
        label: "store.histories.label",
        icon: History,
        children: {
          history: {
            path: "/:store/histories/:id",
            label: "store.histories.history.label",
          },
        },
      },
      roles: {
        path: "/:store/roles",
        label: "store.roles.label",
        icon: Badge,
      },
      employees: {
        path: "/:store/employees",
        label: "store.employees.label",
        icon: Group,
      },
      broadcasts: {
        path: "/:store/broadcasts",
        label: "store.broadcasts.label",
        icon: Campaign,
        children: {
          broadcast: {
            path: "/:store/broadcasts/:id",
            label: "store.broadcasts.broadcast.label",
          },
          create: {
            path: "/:store/broadcasts/new",
            label: "store.broadcasts.create.label",
          },
        },
      },
      promotions: {
        path: "/:store/promotions",
        label: "store.promotions.label",
        icon: LocalOffer,
        children: {
          create: {
            path: "/:store/promotions/create",
            label: "store.promotions.create.label",
            disabledBreadcrumb: true,
            children: {
              buyXgetY: {
                path: "/:store/promotions/create/buyXgetY",
                label: "store.promotions.create.buyXgetY.label",
              },
            },
          },
          buyXgetY: {
            path: "/:store/promotions/buyXgetY/:id",
            label: "store.promotions.buyXgetY.label",
          },
        },
      },
      applications: {
        path: "/:store/applications",
        label: "store.applications.label",
        icon: SettingsApplications,
        children: {
          line: {
            path: "/:store/applications/line/:id",
            label: "store.applications.line.label",
            children: {
              create: {
                path: "/:store/applications/line/create",
                label: "store.applications.create.label",
                disabledBreadcrumb: true,
              },
            },
          },
        },
      },
      preorders: {
        path: "/:store/preorders",
        label: "store.preorders.label",
        icon: RotateRight,
      },
      consignments: {
        path: "/:store/consignments",
        label: "store.consignments.label",
        icon: AllInbox,
        children: {
          consignment: {
            path: "/:store/consignments/:id",
            label: "store.consignments.consignment.label",
          },
        },
      },
      //account
      account: {
        path: "/:store/account",
        label: "store.account.label",
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
      new: {
        path: "/new",
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
