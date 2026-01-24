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
  projects: {
    path: "/projects",
    label: "store.label",
    children: {
      store: {
        path: "/projects/:store",
        label: "store.label",
        children: {
          dashboard: {
            path: "/projects/:store/dashboard",
            label: "store.dashboard.label",
            icon: Store,
            disabledBreadcrumb: true,
            children: {
              report: {
                path: "/projects/:store/dashboard/report",
                label: "dashboard.report.label",
              },
            },
          },
          cashier: {
            path: "/projects/:store/cashier",
            label: "store.cashier.label",
            icon: ShoppingCart,
          },
          products: {
            path: "/projects/:store/products",
            label: "store.products.label",
            icon: Work,
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
          },
          stocks: {
            path: "/projects/:store/stocks",
            label: "store.stocks.label",
            icon: AllInbox,
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
          },
          employees: {
            path: "/projects/:store/employees",
            label: "store.employees.label",
            icon: Group,
          },
          broadcasts: {
            path: "/projects/:store/broadcasts",
            label: "store.broadcasts.label",
            icon: Campaign,
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
          },
          consignments: {
            path: "/projects/:store/consignments",
            label: "store.consignments.label",
            icon: AllInbox,
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
