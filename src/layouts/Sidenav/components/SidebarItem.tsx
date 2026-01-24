"use client";
import { useActiveRouteTrail } from "@/hooks/useActiveRouteTrail";
import { Route } from "@/libs/route/route";
import { getPath } from "@/router";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useTranslations } from "next-intl";
import RouterLink from "next/link";

function SidebarItem(route: Readonly<Route>): React.JSX.Element {
  const activeRouteTrail = useActiveRouteTrail();
  const isActive = activeRouteTrail.some(
    (item: Route) => item.name === route.name,
  );
  const t = useTranslations("ROUTES");

  return (
    <ListItem
      sx={{
        p: 0,
      }}
    >
      <ListItemButton
        {...(route.path
          ? {
              component: RouterLink,
              href: getPath(route.name),
            }
          : { role: "button" })}
        data-active={isActive ? "true" : "false"}
        sx={{
          alignItems: "center",
          borderRadius: 1,
          cursor: "pointer",
          display: "flex",
          flex: "0 0 auto",
          gap: 1,
          position: "relative",
          textDecoration: "none",
          whiteSpace: "nowrap",
          transition: "0.2s background ease",
          minHeight: "45px",
          margin: "0 0 6px 0",
          padding: "0 0",
          width: "100%",
          color: "var(--SidebarItem-color)",
          "&.Mui-focusVisible": {
            color: "var(--SidebarItem-color)",
            bgcolor: "var(--SidebarItem-hover-background)",
          },
          "&[data-active='true']": {
            bgcolor: "var(--SidebarItem-active-background)",
            color: "var(--SidebarItem-active-color)",

            "&:hover": {
              bgcolor: "var(--SidebarItem-hover-active-background)",
            },
          },
          "&:not([data-active='true']):hover": {
            bgcolor: "var(--SidebarItem-hover-background)",
          },
        }}
      >
        {route.icon && (
          <ListItemIcon
            sx={{
              color: isActive
                ? "var(--SidebarItem-icon-active-color)"
                : "var(--SidebarItem-icon-color)",
              minWidth: "0px",
              marginX: "0.6em",
            }}
          >
            {<route.icon fontSize={"medium"} />}
          </ListItemIcon>
        )}

        <ListItemText
          primary={t(route.label)}
          slotProps={{
            primary: {
              sx: {
                color: isActive
                  ? "var(--SidebarItem-active-color)"
                  : "var(--SidebarItem-color)",

                fontWeight: 500,
                lineHeight: "28px",
                fontSize: "0.875em",
              },
            },
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}

export default SidebarItem;
