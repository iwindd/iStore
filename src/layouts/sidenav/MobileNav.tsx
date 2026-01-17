"use client";
import { alpha, Box, Drawer, useTheme } from "@mui/material";
import NavItems from "./components";
import NavLogo from "./components/NavLogo";

export interface MobileNavProps {
  onClose?: () => void;
  open?: boolean;
}

const MobileNav = ({ open, onClose }: MobileNavProps) => {
  const theme = useTheme();

  return (
    <Drawer
      onClose={onClose}
      open={open}
      slotProps={{
        paper: {
          sx: {
            "--MobileNav-color": "var(--mui-palette-common-white)",
            "--MobileNav-background": "var(--mui-palette-background-paper)",
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
            "--NavItem-disabled-color": "var(--mui-palette-neutral-500)",
            "--NavItem-icon-color": alpha(theme.palette.secondary.light, 0.9),
            "--NavItem-icon-active-color": theme.palette.primary.dark,
            "--NavItem-icon-disabled-color": "var(--mui-palette-neutral-600)",
            "--NavItem-group-label-color": alpha(
              theme.palette.secondary.light,
              0.9,
            ),
            bgcolor: "var(--MobileNav-background)",
            color: "var(--MobileNav-color)",
            display: "flex",
            flexDirection: "column",
            maxWidth: "100%",
            scrollbarWidth: "none",
            width: "var(--MobileNav-width)",
            zIndex: "var(--MobileNav-zIndex)",
            "&::-webkit-scrollbar": { display: "none" },
          },
        },
      }}
    >
      <NavLogo
        slotProps={{
          stack: {
            sx: {
              position: "sticky",
              top: 0,
              background: "var(--MobileNav-background)",
              zIndex: "var(--SideNav-zIndex)",
              p: 2,
              pt: 2,
            },
          },
        }}
      />
      <Box component="nav" sx={{ flex: "1 1 auto", p: "12px" }}>
        {NavItems()}
      </Box>
    </Drawer>
  );
};

export default MobileNav;
