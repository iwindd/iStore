"use client";
import NavbarItems, { NavbarItem } from "@/config/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { useActiveRouteTrail } from "@/hooks/useActiveRouteTrail";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse, List, ListItemButton, ListItemText } from "@mui/material";
import React, { useState } from "react";
import NavItem from "./NavItem";

const NavItems = () => {
  const { user } = useAuth();
  const [expand, setExpand] = useState<Record<string, boolean>>(() => {
    const expandItems: Record<string, boolean> = {};

    NavbarItems.forEach((navItem: NavbarItem) => {
      if ("defaultExpand" in navItem && navItem.defaultExpand) {
        expandItems[navItem.key] = true;
      }
    });

    return expandItems;
  });
  const activeRouteTrail = useActiveRouteTrail();
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
    <List sx={{ py: 0 }}>
      {NavbarItems.map((navItem: NavbarItem) => {
        if ("routes" in navItem) {
          const items = navItem.routes
            .map((item) => renderNormalItem(item))
            .filter((item) => item !== undefined);

          if (items.length === 0) return null;

          const isActive = activeRouteTrail.some((activeRoute) =>
            navItem.routes.some((route) => route.name === activeRoute.name)
          );

          return (
            <React.Fragment key={`Group-${navItem.key}`}>
              <ListItemButton
                sx={{
                  alignItems: "center",
                  borderRadius: 0.3,
                  cursor: "pointer",
                  display: "flex",
                  flex: "0 0 auto",
                  gap: 1,
                  position: "relative",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  transition: "0.1s background ease",
                  minHeight: "40px",
                  margin: "0 0 6px 0",
                  padding: "0 6px",
                  backgroundColor: isActive
                    ? "var(--NavItem-hover-background)"
                    : "transparent",
                }}
                onClick={() =>
                  setExpand({ ...expand, [navItem.key]: !expand[navItem.key] })
                }
              >
                <ListItemText
                  primary={navItem.title}
                  slotProps={{
                    primary: {
                      sx: {
                        color: "var(--NavItem-color)",
                        fontWeight: 500,
                        lineHeight: "28px",
                        fontSize: "0.875em",
                      },
                    },
                  }}
                />
                {expand[navItem.key] || isActive ? (
                  <ExpandLess
                    sx={{
                      color: "var(--NavItem-icon-color)",
                    }}
                  />
                ) : (
                  <ExpandMore
                    sx={{
                      color: "var(--NavItem-icon-color)",
                    }}
                  />
                )}
              </ListItemButton>

              <Collapse
                in={expand[navItem.key] || isActive}
                timeout={"auto"}
                unmountOnExit
              >
                {items}
              </Collapse>
            </React.Fragment>
          );
        } else {
          const item = renderNormalItem(navItem);
          if (!item) return null;
          return item;
        }
      })}
    </List>
  );
};

export default NavItems;
