"use client";
import { SidebarItem } from "@/config/Navbar";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { toggleNavbarVariant } from "@/reducers/uiReducer";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import {
  alpha,
  Box,
  IconButton,
  Stack,
  Tooltip,
  useTheme,
} from "@mui/material";
import { useTranslations } from "next-intl";
import SidebarItems from "..";
import NavLogo from "./SidebarLogo";

const DesktopSidebar = ({ items }: Readonly<{ items: SidebarItem[] }>) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navbarVariant = useAppSelector((state) => state.ui.navbarVariant);
  const isCollapsed = navbarVariant === "collapse";
  const t = useTranslations("SIDEBAR");

  const handleToggle = () => {
    dispatch(toggleNavbarVariant());
  };

  return (
    <Box
      sx={{
        "--SideNav-color": "var(--mui-palette-common-white)",
        "--SideNav-background": "var(--mui-palette-background-paper)",
        "--SidebarItem-color": alpha(theme.palette.secondary.light, 0.9),
        "--SidebarItem-hover-background": "rgba(0, 0, 0, 0.04)",
        "--SidebarItem-active-background": alpha(
          theme.palette.primary.main,
          0.08,
        ),
        "--SidebarItem-hover-active-background": alpha(
          theme.palette.primary.main,
          0.2,
        ),
        "--SidebarItem-active-color": theme.palette.primary.dark,
        "--SidebarItem-icon-color": alpha(theme.palette.secondary.light, 0.9),
        "--SidebarItem-icon-active-color": theme.palette.primary.dark,
        "--SidebarItem-group-label-color": alpha(
          theme.palette.secondary.light,
          0.9,
        ),
        bgcolor: "var(--SideNav-background)",
        color: "var(--SideNav-color)",
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        height: "100%",
        left: 0,
        maxWidth: "100%",
        position: "fixed",
        borderRight: "1px solid var(--mui-palette-divider)",
        scrollbarWidth: "none",
        top: 0,
        width: "var(--SideNav-width)",
        zIndex: "var(--SideNav-zIndex)",
        transition: "width 0.3s ease",
      }}
    >
      <Stack position={"relative"}>
        {/* Toggle button positioned at center of right border */}
        <Tooltip
          title={isCollapsed ? t("expand") : t("collapse")}
          placement="right"
        >
          <IconButton
            onClick={handleToggle}
            size="small"
            sx={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translate(50%, -50%)",
              width: 24,
              height: 24,
              bgcolor: "var(--mui-palette-background-paper)",
              border: "1px solid var(--mui-palette-divider)",
              color: "var(--SidebarItem-icon-color)",
              "&:hover": {
                color: theme.palette.primary.main,
                bgcolor: "var(--mui-palette-background-paper)",
              },
            }}
          >
            {isCollapsed ? (
              <ChevronRight sx={{ fontSize: 16 }} />
            ) : (
              <ChevronLeft sx={{ fontSize: 16 }} />
            )}
          </IconButton>
        </Tooltip>
        <NavLogo isCollapsed={isCollapsed} />
      </Stack>

      <Box
        component="nav"
        sx={{
          flex: "1 1 auto",
          px: isCollapsed ? "8px" : "18px",
          overflowY: "auto",
          "&::-webkit-scrollbar": { display: "none" },
          transition: "padding 0.3s ease",
        }}
      >
        <SidebarItems items={items} isCollapsed={isCollapsed} />
      </Box>
    </Box>
  );
};

export default DesktopSidebar;
