"use client";
import { SidebarItem } from "@/config/Navbar";
import { alpha, Box, useTheme } from "@mui/material";
import SidebarItems from "..";
import NavLogo from "./SidebarLogo";

const DesktopSidebar = ({ items }: Readonly<{ items: SidebarItem[] }>) => {
  const theme = useTheme();

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
      }}
    >
      <NavLogo />

      <Box
        component="nav"
        sx={{
          flex: "1 1 auto",
          px: "18px",
          overflowY: "auto",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <SidebarItems items={items} />
      </Box>
    </Box>
  );
};

export default DesktopSidebar;
