"use client";
import { hasPermission } from "@/libs/permission";
import NavItem from "./navItem";
import navItems, { NavItemType } from "@/config/Navbar";
import { Stack } from "@mui/material";
import { Session } from "next-auth";

interface RenderNavItemsProps {
  pathname: string;
  session: Session | null;
}

const NavItems = ({ pathname, session }: RenderNavItemsProps) => {
  const items = navItems;
  const userPermission = session?.user?.permission;

  const children = items.reduce(
    (acc: React.ReactNode[], navItem: NavItemType): React.ReactNode[] => {
      const { key, somePermissions, ...item } = navItem.path;
      const userPermBit = userPermission ? BigInt(userPermission) : 0n;
      if (somePermissions && !userPermission) return acc;

      const hasSomePermissions = somePermissions?.some((permission) => {
        return hasPermission(userPermBit, permission);
      });

      if (somePermissions && !hasSomePermissions) return acc;
      acc.push(<NavItem key={key} pathname={pathname} {...item} />);
      return acc;
    },
    []
  );

  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: "none", m: 0, p: 0 }}>
      {children}
    </Stack>
  );
};

export default NavItems;
