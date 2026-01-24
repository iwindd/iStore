"use client";
import { NavbarItem } from "@/config/Navbar";
import { alpha, Box, Drawer, Stack, useTheme } from "@mui/material";
import NavItems from "./components";
import NavLogo from "./components/NavLogo";

export interface MobileNavProps {
  items?: NavbarItem[];
  onClose?: () => void;
  open?: boolean;
}

const MobileNav = ({ items, open, onClose }: MobileNavProps) => {
  const theme = useTheme();

  return (
    <Drawer
      PaperProps={{
        sx: {
          "--SideNav-color": "var(--mui-palette-common-white)",
          "--SideNav-background": "var(--mui-palette-background-paper)",
          "--NavItem-color": alpha(theme.palette.secondary.light, 0.9),
          "--NavItem-hover-background": "rgba(0, 0, 0, 0.04)",
          "--NavItem-active-background": alpha(
            theme.palette.primary.main,
            0.08,
          ),
          "--NavItem-hover-active-background": alpha(
            theme.palette.primary.main,
            0.2,
          ),
          "--NavItem-active-color": theme.palette.primary.dark,
          "--NavItem-icon-color": alpha(theme.palette.secondary.light, 0.9),
          "--NavItem-icon-active-color": theme.palette.primary.dark,
          "--NavItem-group-label-color": alpha(
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
          <NavItems items={items} />
        </Box>
      </Stack>
    </Drawer>
  );
};

export default MobileNav;
