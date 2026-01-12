"use client";
import { useActiveRouteTrail } from "@/hooks/useActiveRouteTrail";
import { Route } from "@/libs/route/route";
import { getPath } from "@/router";
import { Box, Typography } from "@mui/material";
import RouterLink from "next/link";

function NavItem(route: Readonly<Route>): React.JSX.Element {
  const activeRouteTrail = useActiveRouteTrail();
  const isActive = activeRouteTrail.some((item) => item.name === route.name);

  return (
    <li>
      <Box
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
          p: "6px 3px",
          position: "relative",
          textDecoration: "none",
          whiteSpace: "nowrap",
          transition: "0.1s background ease",
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
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            flex: "0 0 auto",
            opacity: isActive ? 1 : 0.4,
            mr: 0.5,
            ml: 0.5,
          }}
        >
          {route.icon ? <route.icon /> : null}
        </Box>
        <Box sx={{ flex: "1 1 auto" }}>
          <Typography
            component="span"
            sx={{
              color: "inherit",
              fontSize: "0.875rem",
              fontWeight: 500,
              lineHeight: "28px",
            }}
          >
            {route.label}
          </Typography>
        </Box>
      </Box>
    </li>
  );
}

export default NavItem;
