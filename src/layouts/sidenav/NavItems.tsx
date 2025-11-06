"use client";
import navItems, { NavItemType } from "@/config/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { Stack, Typography } from "@mui/material";
import NavItem from "./NavItem";

interface RenderNavItemsProps {
  pathname: string;
}

const NavItems = ({ pathname }: RenderNavItemsProps) => {
  const { user } = useAuth();
  const renderNormalItem = (navItem: NavItemType) => {
    if (navItem.type == "group") return;
    const {
      key,
      somePermissions: needSomePermissions,
      ...restPath
    } = navItem.path;

    if (
      needSomePermissions &&
      !user?.hasSomePermissions(...needSomePermissions)
    )
      return;

    return (
      <NavItem
        key={`item-${navItem.path.key}`}
        pathname={pathname}
        {...restPath}
      />
    );
  };

  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: "none", m: 0, p: 0 }}>
      {navItems.map((navItem: NavItemType) => {
        if (navItem.type == "item") {
          const item = renderNormalItem(navItem);
          if (!item) return null;
          return item;
        } else {
          const items = navItem.items
            .map((item) =>
              renderNormalItem({
                ...item,
                path: {
                  ...item.path,
                  key: `group-${navItem.key}-${item.path.key}`,
                },
                type: "item",
              })
            )
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
        }
      })}
    </Stack>
  );
};

export default NavItems;
