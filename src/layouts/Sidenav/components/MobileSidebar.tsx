"use client";
import { SidebarItem } from "@/config/Navbar";
import { useAppSelector } from "@/hooks";
import { alpha, Box, Drawer, Stack, useTheme } from "@mui/material";
import SidebarItems from "..";
import NavLogo from "./SidebarLogo";

export interface MobileSidebarProps {
  items: SidebarItem[];
  onClose?: () => void;
  open?: boolean;
}

const MobileSidebar = ({ items, open, onClose }: MobileSidebarProps) => {
  const theme = useTheme();
  const mode = useAppSelector((state) => state.ui.themeMode);

  return (
    <Drawer
      slotProps={{
        paper: {
          sx: {
            "--SideNav-color": "var(--mui-palette-common-white)",
            "--SideNav-background": "var(--mui-palette-background-paper)",

            "--SidebarItem-color":
              mode === "dark"
                ? `rgba(var(--mui-palette-secondary-lightChannel) / 48%)`
                : alpha(theme.palette.secondary.light, 0.9),

            "--SidebarItem-hover-background":
              mode === "dark"
                ? "rgba(var(--mui-palette-secondary-lightChannel) / 5%)"
                : "rgba(var(--mui-palette-secondary-darkChannel) / 12%)",

            "--SidebarItem-active-background": alpha(
              theme.palette.primary.main,
              0.08,
            ),
            "--SidebarItem-hover-active-background": alpha(
              theme.palette.primary.main,
              0.2,
            ),
            "--SidebarItem-active-color":
              mode === "dark"
                ? theme.palette.primary.light
                : theme.palette.primary.dark,

            "--SidebarItem-icon-color":
              mode === "dark"
                ? theme.palette.grey[600]
                : alpha(theme.palette.secondary.light, 0.9),
            "--SidebarItem-icon-active-color":
              mode === "dark"
                ? theme.palette.primary.light
                : theme.palette.primary.dark,
            "--SidebarItem-group-label-color":
              mode === "dark"
                ? `rgba(var(--mui-palette-secondary-lightChannel) / 38%)`
                : `rgba(var(--mui-palette-secondary-darkChannel) / 60%)`,
            display: { xs: "flex", lg: "none" },
            flexDirection: "column",
            maxWidth: "100%",
            scrollbarWidth: "none",
            width: "var(--MobileNav-width)",
            zIndex: "var(--MobileNav-zIndex)",
            "&::-webkit-scrollbar": { display: "none" },
          },
        },
      }}
      onClose={onClose}
      open={open}
    >
      <Stack spacing={2} sx={{ py: 3 }}>
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
      </Stack>
    </Drawer>
  );
};

export default MobileSidebar;
