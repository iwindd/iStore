import icons from "./Icons";

export interface Path{
  key: string,
  title: string,
  href: string,
  icon: keyof typeof icons,
  disableBreadcrumb?: boolean,
  disableNav?: boolean,
  matcher?: { type: 'startsWith' | 'equals'; href: string };
}

const Paths = {
  'overview' : { key: 'overview', title: 'ภาพรวม', href: "/", icon: 'chart-pie' },
  'cashier': { key: 'cashier', title: 'ขายสินค้า', href: "/cashier", icon: 'cashier' },
  'products': { key: 'products', title: 'สินค้า', href: "/products", icon: 'product' },
  'categories': { key: 'categories', title: 'ประเภทสินค้า', href: "/categories", icon: 'category' },
  'stock': { key: 'stock', title: 'จัดการสต๊อก', href: "/stocks", icon: 'stock' },
  'overstocks': { key: 'overstocks', title: 'สินค้าค้าง', href: "/overstocks", icon: 'overstocks'},
  'borrows': { key: 'borrows', title: 'การเบิก', href: "/borrows", icon: 'borrows' },
  'purchase': { key: 'purchase', title: 'ซื้อสินค้า', href: "/purchase", icon: 'purchase', matcher: { type: 'startsWith', href: "/purchase"} },
  'purchase.purchase': { key: 'purchase', title: 'รายละเอียดการซื้อสินค้า', href: "/purchase/:pid", icon: 'purchase' , disableNav: true },
  'histories': { key: 'histories', title: 'ประวัติการขายสินค้า', href: "/histories", icon: 'history', matcher: { type: 'startsWith', href: "/histories"} },
  'histories.history': { key: 'histories.history', title: 'รายละเอียดการขายสินค้า', href: "/histories/:hid", icon: 'history', disableNav: true },
  'signin': { key: 'signin', title: 'เข้าสู่ระบบ', href: "/auth/signin", icon: 'signin', disableBreadcrumb: true, disableNav: true },
  'signup': { key: 'signup', title: 'ลงทะเบียน', href: "/auth/signup", icon: 'signup', disableBreadcrumb: true, disableNav: true },
  'account': { key: 'account', title: 'บัญชี', href: "/account", icon: 'account'},
  'roles': { key: 'roles', title: 'ตำแหน่ง', href: "/roles", icon: 'group' },
  'employees': { key: 'employees', title: 'พนักงาน', href: "/employees", icon: 'employee' },
} satisfies Record<string, Path>

export const Path = (name: keyof typeof Paths) => Paths[name];
export default Object.values(Paths) as Path[];