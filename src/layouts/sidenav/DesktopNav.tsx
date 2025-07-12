"use client";
import Logo from "@/components/core/logo";
import { Box, Divider, Stack } from "@mui/material";
import React from "react";
import RouterLink from "next/link";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import { HomePath } from "@/config/Path";
import NavItems from "./NavItems";

const DesktopNav = (session: { session: Session | null }) => {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        "--SideNav-color": "var(--mui-palette-common-white)",
        "--SideNav-background": "var(--mui-palette-background-paper)",
        "--MobileNav-color": "var(--mui-palette-common-white)",
        "--NavItem-color": "var(--mui-palette-text-primary)",
        "--NavItem-hover-background": "rgba(255, 255, 255, 0.04)",
        "--NavItem-active-background": "var(--mui-palette-primary-main)",
        "--NavItem-active-color": "var(--mui-palette-primary-contrastText)",
        "--NavItem-disabled-color": "var(--mui-palette-neutral-500)",
        "--NavItem-icon-color": "var(--mui-palette-neutral-400)",
        "--NavItem-icon-active-color":
          "var(--mui-palette-primary-contrastText)",
        "--NavItem-icon-disabled-color": "var(--mui-palette-neutral-600)",
        bgcolor: "var(--SideNav-background)",
        color: "var(--SideNav-color)",
        display: { xs: "none", lg: "flex" },
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
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box
          component={RouterLink}
          href={HomePath}
          sx={{ display: "inline-flex", textDecoration: "none" }}
        >
          <Logo />
        </Box>
      </Stack>
      <Box component="nav" sx={{ flex: "1 1 auto", p: "12px" }}>
        {NavItems({ pathname, session: session.session })}
      </Box>
      <Divider sx={{ borderColor: "var(--mui-palette-neutral-700)" }} />
    </Box>
  );
};

export default DesktopNav;
