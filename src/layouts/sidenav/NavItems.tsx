"use client";
import NavbarItems, { NavbarItem } from "@/config/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { Stack, Typography } from "@mui/material";
import NavItem from "./NavItem";

const NavItems = () => {
  const { user } = useAuth();
  const renderNormalItem = (navItem: NavbarItem) => {
    if ("routes" in navItem) return;
    const { needSomePermissions, ...restPath } = navItem;

    if (
      needSomePermissions &&
      !user?.hasSomePermissions(...needSomePermissions)
    )
      return;

    return <NavItem key={`navbar-item-${restPath.name}`} {...restPath} />;
  };

  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: "none", m: 0, p: 0 }}>
      {NavbarItems.map((navItem: NavbarItem) => {
        if ("routes" in navItem) {
          const items = navItem.routes
            .map((item) => renderNormalItem(item))
            .filter((item) => item !== undefined);

          if (items.length === 0) return null;

          items.unshift(
            <li key={`group-${navItem.key}`}>
              <Typography
                color={"inherit"}
                variant="caption"
                sx={{
                  color: "var(--NavItem-color)",
                }}
              >
                {navItem.title}
              </Typography>
            </li>
          );

          return items;
        } else {
          const item = renderNormalItem(navItem);
          if (!item) return null;
          return item;
        }
      })}
    </Stack>
  );
};

export default NavItems;
