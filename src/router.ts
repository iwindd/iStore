import {
  AllInbox,
  BackHand,
  Badge,
  Campaign,
  Category,
  Group,
  History,
  LocalOffer,
  Login,
  Person,
  ReceiptLong,
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
    label: "ภาพรวม",
    icon: Store,
    disabledBreadcrumb: true,
    children: {
      dashboard: {
        path: "/dashboard",
        label: "ภาพรวม",
        icon: Store,
        disabledBreadcrumb: true,
        children: {
          report: {
            path: "/dashboard/report",
            label: "รายงาน",
          },
        },
      },
    },
  },
  cashier: {
    path: "/cashier",
    label: "ขายสินค้า",
    icon: ShoppingCart,
  },
  products: {
    path: "/products",
    label: "สินค้า",
    icon: Work,
    children: {
      product: {
        path: "/products/:id",
        label: "ข้อมูลสินค้า",
        children: {
          information: {
            path: "/products/:id/information",
            label: "ข้อมูลสินค้า",
          },
          stock: {
            path: "/products/:id/stock",
            label: "สต็อก",
          },
          history: {
            path: "/products/:id/history",
            label: "ประวัติการขาย",
          },
        },
      },
    },
  },
  categories: {
    path: "/categories",
    label: "หมวดหมู่",
    icon: Category,
  },
  stocks: {
    path: "/stocks",
    label: "จัดการสต๊อก",
    icon: AllInbox,
    children: {
      create: {
        path: "/stocks/create",
        label: "สร้างรายการจัดการสต๊อก",
      },
      stock: {
        path: "/stocks/:id",
        label: "รายละเอียดการจัดการสต๊อก",
      },
    },
  },
  overstocks: {
    path: "/overstocks",
    label: "สินค้าถูกจอง",
    icon: RotateRight,
  },
  borrows: {
    path: "/borrows",
    label: "เบิกสินค้า",
    icon: BackHand,
  },
  purchase: {
    path: "/purchase",
    label: "การสั่งซื้อ",
    icon: ReceiptLong,
    children: {
      purchase: {
        path: "/purchase/:id",
        label: "รายละเอียดการสั่งซื้อ",
      },
    },
  },
  histories: {
    path: "/histories",
    label: "ประวัติการขาย",
    icon: History,
    children: {
      history: {
        path: "/histories/:id",
        label: "รายละเอียดการขาย",
      },
    },
  },
  account: {
    path: "/account",
    label: "บัญชีของฉัน",
    icon: Person,
  },
  roles: {
    path: "/roles",
    label: "ตำแหน่ง",
    icon: Badge,
  },
  employees: {
    path: "/employees",
    label: "พนักงาน",
    icon: Group,
  },
  store: {
    path: "/store",
    label: "ร้านค้า",
    icon: Settings,
  },
  broadcasts: {
    path: "/broadcasts",
    label: "ประชาสัมพันธ์",
    icon: Campaign,
    children: {
      broadcast: {
        path: "/broadcasts/:id",
        label: "รายละเอียดประชาสัมพันธ์",
        children: {
          edit: {
            path: "/broadcasts/:id/edit",
            label: "แก้ไข",
          },
        },
      },
      create: {
        path: "/broadcasts/new",
        label: "สร้างใหม่",
      },
    },
  },
  promotions: {
    path: "/promotions",
    label: "โปรโมชั่น",
    icon: LocalOffer,
    children: {
      create: {
        path: "/promotions/create",
        label: "create",
        disabledBreadcrumb: true,
        children: {
          buyXgetY: {
            path: "/promotions/create/buyXgetY",
            label: "สร้างโปรโมชั่น ซื้อ X ได้ Y",
          },
        },
      },
      buyXgetY: {
        path: "/promotions/buyXgetY/:id",
        label: "รายละเอียดโปรโมชั่น",
      },
    },
  },
  applications: {
    path: "/applications",
    label: "แอพพลิเคชั่น",
    icon: SettingsApplications,
    children: {
      create: {
        path: "/applications/create",
        label: "create",
        children: {
          line: {
            path: "/applications/create/line",
            label: "line",
          },
        },
      },
      line: {
        path: "/applications/line/:id",
        label: "line",
      },
    },
  },
  auth: {
    path: "/auth",
    label: "auth",
    icon: Login,
    children: {
      signin: {
        path: "/auth/signin",
        label: "signin",
        icon: Login,
      },
      signup: {
        path: "/auth/signup",
        label: "signup",
        icon: Login,
      },
    },
  },
  preorders: {
    path: "/preorders",
    label: "พรีออเดอร์",
    icon: RotateRight,
  },
});

export const {
  getRoute,
  getPath,
  getParamsFromPath,
  findRouteTrail,
  findActiveRoute,
} = buildRouteUtility(ROUTES);
