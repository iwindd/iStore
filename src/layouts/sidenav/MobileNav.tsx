"use client";
import { Box, Drawer } from "@mui/material";
import NavItems from "./components";

export interface MobileNavProps {
  onClose?: () => void;
  open?: boolean;
}

const MobileNav = ({ open, onClose }: MobileNavProps) => {
  return (
    <Drawer
      onClose={onClose}
      open={open}
      slotProps={{
        paper: {
          sx: {
            "--MobileNav-background": "var(--mui-palette-neutral-950)",
            "--MobileNav-color": "var(--mui-palette-common-white)",
            "--NavItem-color": "var(--mui-palette-neutral-300)",
            "--NavItem-hover-background": "rgba(255, 255, 255, 0.04)",
            "--NavItem-active-background": "var(--mui-palette-primary-main)",
            "--NavItem-active-color": "var(--mui-palette-primary-contrastText)",
            "--NavItem-disabled-color": "var(--mui-palette-neutral-500)",
            "--NavItem-icon-color": "var(--mui-palette-neutral-400)",
            "--NavItem-icon-active-color":
              "var(--mui-palette-primary-contrastText)",
            "--NavItem-icon-disabled-color": "var(--mui-palette-neutral-600)",
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
      <Box component="nav" sx={{ flex: "1 1 auto", p: "12px" }}>
        {NavItems()}
      </Box>
    </Drawer>
  );
};

export default MobileNav;
