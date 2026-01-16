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

function NavItem(route: Readonly<Route>): React.JSX.Element {
  const activeRouteTrail = useActiveRouteTrail();
  const isActive = activeRouteTrail.some((item) => item.name === route.name);
  const t = useTranslations("ROUTES");

  return (
    <ListItem
      {...(route.path
        ? {
            component: RouterLink,
            href: getPath(route.name),
          }
        : { role: "button" })}
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
        padding: "0 0",
        ...(route.disabled && {
          bgcolor: "var(--NavItem-disabled-background)",
          color: "var(--NavItem-disabled-color)",
          cursor: "not-allowed",
        }),
        ...(isActive
          ? {
              bgcolor: "var(--NavItem-active-background)",
              color: "var(--NavItem-active-color)",
            }
          : {
              color: "var(--NavItem-color)",
              "&:hover": {
                bgcolor: "var(--NavItem-hover-background)",
              },
            }),
      }}
    >
      <ListItemButton
        disableRipple
        disableTouchRipple
        sx={{
          background: "transparent",
          "&:hover": {
            background: "transparent",
          },
          padding: "0 5px",
        }}
      >
        {route.icon && (
          <ListItemIcon
            sx={{
              color: isActive
                ? "var(--NavItem-icon-active-color)"
                : "var(--NavItem-icon-color)",
              minWidth: "0px",
              marginRight: "0.6em",
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
                  ? "var(--NavItem-active-color)"
                  : "var(--NavItem-color)",

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

export default NavItem;
