"use client";
import NavbarItems, { NavbarItem } from "@/config/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { useActiveRouteTrail } from "@/hooks/useActiveRouteTrail";
import { Route } from "@/libs/route/route";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse, List, ListItemButton, ListItemText } from "@mui/material";
import React, { useState } from "react";
import NavItem from "./NavItem";

function getDefaultExpand(activeRouteTrail: Route[]) {
  const expandItems: Record<string, boolean> = {};

  NavbarItems.forEach((navItem: NavbarItem) => {
    if ("defaultExpand" in navItem && navItem.defaultExpand) {
      expandItems[navItem.key] = true;
    } else if ("routes" in navItem) {
      const isActive = activeRouteTrail.some((route) =>
        navItem.routes.some((item) => item.name === route.name),
      );
      expandItems[navItem.key] = isActive;
    }
  });

  return expandItems;
}

const NavItems = () => {
  const { user } = useAuth();
  const activeRouteTrail = useActiveRouteTrail();

  const [expand, setExpand] = useState<Record<string, boolean>>(
    getDefaultExpand(activeRouteTrail),
  );

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

          return (
            <React.Fragment key={`Group-${navItem.key}`}>
              <ListItemButton
                onClick={() => {
                  setExpand({ ...expand, [navItem.key]: !expand[navItem.key] });
                }}
                disableRipple
                sx={{
                  alignItems: "center",
                  borderRadius: 0.3,
                  cursor: "pointer",
                  display: "flex",
                  flex: "0 0 auto",
                  gap: 0,
                  position: "relative",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  transition: "0.1s background ease",
                  margin: "0 0 6px 0",
                  padding: "0 6px",
                  fontWeight: "bold",
                  backgroundColor: "transparent",
                  fontSize: "0.75em",
                  color: "var(--NavItem-group-label-color)",
                  width: "fit-content",
                  "&:hover": {
                    backgroundColor: "transparent",
                    color: "black",
                  },
                  "&.Mui-focusVisible": {
                    backgroundColor: "transparent",
                    color: "black",
                  },
                  "&:hover .nav-expand-icon, &.Mui-focusVisible .nav-expand-icon":
                    {
                      width: "0.75em",
                      opacity: 1,
                    },
                  "& .nav-expand-icon": {
                    width: 0,
                    opacity: 0,
                    color: "inherit",
                    fontSize: "1.5em",
                    transition: "width 0.25s ease, opacity 0.3s ease",
                    transformOrigin: "left",
                    marginRight: "6px",
                  },
                  "& .nav-label": {
                    color: "inherit",
                    transition: "0.2s color ease",
                    fontWeight: "bold",
                    lineHeight: "28px",
                    fontSize: "inherit",
                    width: "fit-content",
                  },
                }}
              >
                {expand[navItem.key] ? (
                  <ExpandMore className="nav-expand-icon" />
                ) : (
                  <ExpandLess className="nav-expand-icon" />
                )}
                <ListItemText
                  primary={navItem.title}
                  slotProps={{
                    primary: {
                      className: "nav-label",
                    },
                  }}
                />
              </ListItemButton>

              <Collapse in={expand[navItem.key]} timeout={"auto"} unmountOnExit>
                {items}
              </Collapse>
            </React.Fragment>
          );
        } else {
          const item = renderNormalItem(navItem);
          if (!item) return null;
        }
      })}
    </List>
  );
};

export default NavItems;
