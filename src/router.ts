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
  overview: {
    path: "/",
    label: "overview.label",
    icon: Store,
    disabledBreadcrumb: true,
    children: {
      dashboard: {
        path: "/dashboard",
        label: "dashboard.label",
        icon: Store,
        disabledBreadcrumb: true,
        children: {
          report: {
            path: "/dashboard/report",
            label: "dashboard.report.label",
          },
        },
      },
    },
  },
  cashier: {
    path: "/cashier",
    label: "cashier.label",
    icon: ShoppingCart,
  },
  products: {
    path: "/products",
    label: "products.label",
    icon: Work,
    children: {
      product: {
        path: "/products/:id",
        label: "products.product.label",
        children: {
          information: {
            path: "/products/:id/information",
            label: "products.product.information.label",
          },
          stock: {
            path: "/products/:id/stock",
            label: "products.product.stock.label",
          },
          history: {
            path: "/products/:id/history",
            label: "products.product.history.label",
          },
        },
      },
    },
  },
  categories: {
    path: "/categories",
    label: "categories.label",
    icon: Category,
  },
  stocks: {
    path: "/stocks",
    label: "stocks.label",
    icon: AllInbox,
    children: {
      create: {
        path: "/stocks/create",
        label: "stocks.create.label",
      },
      stock: {
        path: "/stocks/:id",
        label: "stocks.stock.label",
      },
    },
  },
  histories: {
    path: "/histories",
    label: "histories.label",
    icon: History,
    children: {
      history: {
        path: "/histories/:id",
        label: "histories.history.label",
      },
    },
  },
  account: {
    path: "/account",
    label: "account.label",
    icon: Person,
  },
  roles: {
    path: "/roles",
    label: "roles.label",
    icon: Badge,
  },
  employees: {
    path: "/employees",
    label: "employees.label",
    icon: Group,
  },
  store: {
    path: "/store",
    label: "store.label",
    icon: Settings,
  },
  broadcasts: {
    path: "/broadcasts",
    label: "broadcasts.label",
    icon: Campaign,
    children: {
      broadcast: {
        path: "/broadcasts/:id",
        label: "broadcasts.broadcast.label",
        children: {
          edit: {
            path: "/broadcasts/:id/edit",
            label: "broadcasts.broadcast.edit.label",
          },
        },
      },
      create: {
        path: "/broadcasts/new",
        label: "broadcasts.create.label",
      },
    },
  },
  promotions: {
    path: "/promotions",
    label: "promotions.label",
    icon: LocalOffer,
    children: {
      create: {
        path: "/promotions/create",
        label: "promotions.create.label",
        disabledBreadcrumb: true,
        children: {
          buyXgetY: {
            path: "/promotions/create/buyXgetY",
            label: "promotions.create.buyXgetY.label",
          },
        },
      },
      buyXgetY: {
        path: "/promotions/buyXgetY/:id",
        label: "promotions.buyXgetY.label",
      },
    },
  },
  applications: {
    path: "/applications",
    label: "applications.label",
    icon: SettingsApplications,
    children: {
      line: {
        path: "/applications/line/:id",
        label: "applications.line.label",
        children: {
          create: {
            path: "/applications/line/create",
            label: "applications.create.label",
            disabledBreadcrumb: true,
          },
        },
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
      signup: {
        path: "/auth/signup",
        label: "auth.signup.label",
        icon: Login,
      },
    },
  },
  preorders: {
    path: "/preorders",
    label: "preorders.label",
    icon: RotateRight,
  },
  consignments: {
    path: "/consignments",
    label: "consignments.label",
    icon: AllInbox,
    children: {
      consignment: {
        path: "/consignments/:id",
        label: "consignments.consignment.label",
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
