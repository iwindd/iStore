"use client";
import { SidebarItem } from "@/config/Navbar";
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

  return (
    <Drawer
      slotProps={{
        paper: {
          sx: {
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
            "--SidebarItem-icon-color": alpha(
              theme.palette.secondary.light,
              0.9,
            ),
            "--SidebarItem-icon-active-color": theme.palette.primary.dark,
            "--SidebarItem-group-label-color": alpha(
              theme.palette.secondary.light,
              0.9,
            ),
            bgcolor: "var(--SideNav-background)",
            color: "var(--SideNav-color)",
            display: { xs: "flex", lg: "none" },
            flexDirection: "column",
            maxWidth: "100%",
            scrollbarWidth: "none",
            width: "var(--SideNav-width)",
            zIndex: "var(--SideNav-zIndex)",
            "&::-webkit-scrollbar": { display: "none" },
          },
        },
      }}
      onClose={onClose}
      open={open}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
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
