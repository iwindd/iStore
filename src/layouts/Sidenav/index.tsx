"use client";
import { SidebarItem } from "@/config/Navbar";
import { useActiveRouteTrail } from "@/hooks/useActiveRouteTrail";
import { Route } from "@/libs/route/route";
import { usePermission } from "@/providers/PermissionProvider";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse, List, ListItemButton, ListItemText } from "@mui/material";
import React, { useState } from "react";
import SidebarItemComponent from "./components/SidebarItem";

function getDefaultExpand(items: SidebarItem[], activeRouteTrail: Route[]) {
  const expandItems: Record<string, boolean> = {};

  items.forEach((sidebarItem: SidebarItem) => {
    if ("defaultExpand" in sidebarItem && sidebarItem.defaultExpand) {
      expandItems[sidebarItem.key] = true;
    } else if ("routes" in sidebarItem) {
      const isActive = activeRouteTrail.some((route) =>
        sidebarItem.routes.some((item) => item.name === route.name),
      );
      expandItems[sidebarItem.key] = isActive;
    }
  });

  return expandItems;
}

const SidebarItems = ({ items }: Readonly<{ items: SidebarItem[] }>) => {
  const activeRouteTrail = useActiveRouteTrail();
  const { hasStorePermission, hasGlobalPermission } = usePermission();

  const [expand, setExpand] = useState<Record<string, boolean>>(
    getDefaultExpand(items, activeRouteTrail),
  );

  const renderNormalItem = (sidebarItem: SidebarItem) => {
    if ("routes" in sidebarItem) return;
    const permission = sidebarItem.permission;

    if (
      permission?.someStore &&
      !hasStorePermission(permission.someStore, true)
    ) {
      return null;
    }

    if (
      permission?.someGlobal &&
      !hasGlobalPermission(permission.someGlobal, true)
    ) {
      return null;
    }

    return (
      <SidebarItemComponent
        key={`navbar-item-${sidebarItem.name}`}
        {...sidebarItem}
      />
    );
  };

  return (
    <List sx={{ py: 0 }}>
      {items.map((sidebarItem: SidebarItem) => {
        if ("routes" in sidebarItem) {
          const items = sidebarItem.routes
            .map((item) => renderNormalItem(item))
            .filter((item) => item != null);

          if (items.length === 0) return null;

          return (
            <React.Fragment key={`Group-${sidebarItem.key}`}>
              <ListItemButton
                onClick={() => {
                  setExpand({
                    ...expand,
                    [sidebarItem.key]: !expand[sidebarItem.key],
                  });
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
                  color: "var(--SidebarItem-group-label-color)",
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
                {expand[sidebarItem.key] ? (
                  <ExpandMore className="nav-expand-icon" />
                ) : (
                  <ExpandLess className="nav-expand-icon" />
                )}
                <ListItemText
                  primary={sidebarItem.title}
                  slotProps={{
                    primary: {
                      className: "nav-label",
                    },
                  }}
                />
              </ListItemButton>

              <Collapse
                in={expand[sidebarItem.key]}
                timeout={"auto"}
                unmountOnExit
              >
                {items}
              </Collapse>
            </React.Fragment>
          );
        } else {
          return renderNormalItem(sidebarItem);
        }
      })}
    </List>
  );
};

export default SidebarItems;
