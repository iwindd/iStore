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
          color: "var(--NavItem-color)",
          "&.Mui-focusVisible": {
            color: "var(--NavItem-color)",
            bgcolor: "var(--NavItem-hover-background)",
          },
          "&[data-active='true']": {
            bgcolor: "var(--NavItem-active-background)",
            color: "var(--NavItem-active-color)",

            "&:hover": {
              bgcolor: "var(--NavItem-hover-active-background)",
            },
          },
          "&:not([data-active='true']):hover": {
            bgcolor: "var(--NavItem-hover-background)",
          },
        }}
      >
        {route.icon && (
          <ListItemIcon
            sx={{
              color: isActive
                ? "var(--NavItem-icon-active-color)"
                : "var(--NavItem-icon-color)",
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
