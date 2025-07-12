import { PermissionEnum } from "@/enums/permission";
import { Path } from "./Path";

export interface NavItemType{
  path: {
    key: string, 
    title: string,
    href: string, 
    icon: string,
    somePermissions?: PermissionEnum[],
  }
}

export interface NavItemConfig {
  key: string;
  title?: string;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  icon?: string;
  href?: string;
  items?: NavItemConfig[];
  matcher?: { type: 'startsWith' | 'equals'; href: string };
  somePermissions?: PermissionEnum[]; 
}

const navItems = [
  { path: Path("overview") },
  { path: Path("cashier") },
  { path: Path("products") },
  { path: Path("categories") },
  { path: Path("stock") },
  { path: Path("overstocks") },
  { path: Path("borrows") },
  { path: Path("purchase") },
  { path: Path("histories") },
  { path: Path("account") },
  { path: Path("roles") },
  { path: Path("employees") },
] as const satisfies NavItemType[];

export default navItems;