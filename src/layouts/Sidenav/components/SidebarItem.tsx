"use client";
import { useRoute } from "@/hooks/use-route";
import { useActiveRouteTrail } from "@/hooks/useActiveRouteTrail";
import { Route } from "@/libs/route/route";
import {
  alpha,
  Badge,
  Chip,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslations } from "next-intl";
import RouterLink from "next/link";

interface SidebarItemProps extends Route {
  badge?: number;
  isCollapsed?: boolean;
}

function SidebarItem({
  badge,
  isCollapsed = false,
  ...route
}: Readonly<SidebarItemProps>): React.JSX.Element {
  const activeRouteTrail = useActiveRouteTrail();
  const isActive = activeRouteTrail.some(
    (item: Route) => item.name === route.name,
  );
  const { path } = useRoute();
  const t = useTranslations("ROUTES");
  const theme = useTheme();

  const itemContent = (
    <ListItem
      sx={{
        p: 0,
      }}
    >
      <ListItemButton
        {...(route.path
          ? {
              component: RouterLink,
              href: path(route.name),
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
          transition: "0.2s background ease",
          minHeight: isCollapsed ? "48px" : "45px",
          margin: "0 0 6px 0",
          padding: isCollapsed ? 1 : "0 0",
          justifyContent: isCollapsed ? "center" : "flex-start",
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
          whiteSpace: isCollapsed ? "normal" : "nowrap",
          flexDirection: isCollapsed ? "column" : "row",
        }}
      >
        {route.icon && (
          <ListItemIcon
            sx={{
              color: isActive
                ? "var(--SidebarItem-icon-active-color)"
                : "var(--SidebarItem-icon-color)",
              minWidth: "0px",
              marginX: isCollapsed ? "0" : "0.6em",
            }}
          >
            <Badge
              badgeContent={badge}
              color="secondary"
              invisible={!isCollapsed}
              sx={{
                "& .MuiBadge-badge": {
                  border: `2px solid ${(theme.vars ?? theme).palette.background.default}`,
                  padding: "0 4px",
                  backgroundColor: isActive
                    ? "var(--SidebarItem-active-color)"
                    : "var(--SidebarItem-icon-color)",

                  fontSize: theme.typography.sidebarCollapsed.fontSize,
                  lineHeight: theme.typography.sidebarCollapsed.lineHeight,
                },
              }}
            >
              {<route.icon fontSize={isCollapsed ? "small" : "medium"} />}
            </Badge>
          </ListItemIcon>
        )}

        {!isCollapsed && (
          <>
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
            {!!badge && badge > 0 && (
              <Chip
                label={badge}
                size="small"
                variant="filled"
                color="secondary"
                sx={{
                  height: 20,
                  minWidth: 20,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "inherit",
                  mr: 1,
                  border: 0,
                  borderRadius: 1,
                  backgroundColor: isActive
                    ? alpha(theme.palette.primary.main, 0.04)
                    : alpha(theme.palette.secondary.light, 0.1),
                }}
              />
            )}
          </>
        )}

        {isCollapsed && (
          <Stack width={"100%"}>
            <Typography
              variant="sidebarCollapsed"
              align="center"
              color={
                isActive
                  ? "var(--SidebarItem-active-color)"
                  : "var(--SidebarItem-color)"
              }
            >
              {t(route.label)}
            </Typography>
          </Stack>
        )}
      </ListItemButton>
    </ListItem>
  );

  return itemContent;
}

export default SidebarItem;
