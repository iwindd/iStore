"use client";
import Logo from "@/components/core/logo";
import { Box, Divider, Drawer, Stack, Typography } from "@mui/material";
import React from "react";
import RouterLink from "next/link";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import Paths, { Path } from "@/config/Path";
import { NavItemConfig } from "../type";
import { isNavItemActive } from "../utils";
import icons from "@/config/Icons";
import { BorderColor, BorderRight } from "@mui/icons-material";
import { hasPermission } from "@/libs/permission";

const sx = {
  "--SideNav-color": "var(--mui-palette-common-white)",
  "--SideNav-background": "var(--mui-palette-background-paper)",
  '--MobileNav-color': 'var(--mui-palette-common-white)',
  "--NavItem-color": "var(--mui-palette-text-primary)",
  "--NavItem-hover-background": "rgba(255, 255, 255, 0.04)",
  "--NavItem-active-background": "var(--mui-palette-primary-main)",
  "--NavItem-active-color": "var(--mui-palette-primary-contrastText)",
  "--NavItem-disabled-color": "var(--mui-palette-neutral-500)",
  "--NavItem-icon-color": "var(--mui-palette-neutral-400)",
  "--NavItem-icon-active-color": "var(--mui-palette-primary-contrastText)",
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
};

export interface MobileNavProps {
  onClose?: () => void;
  open?: boolean;
  items?: Path[];
  session: Session | null;
}

export const MobileNav = ({ open, onClose, session }: MobileNavProps) => {
  const pathname = usePathname();

  return (
    <Drawer
      PaperProps={{
        sx: {
          '--MobileNav-background': 'var(--mui-palette-neutral-950)',
          '--MobileNav-color': 'var(--mui-palette-common-white)',
          '--NavItem-color': 'var(--mui-palette-neutral-300)',
          '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
          '--NavItem-active-background': 'var(--mui-palette-primary-main)',
          '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
          '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
          '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
          '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
          '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
          bgcolor: 'var(--MobileNav-background)',
          color: 'var(--MobileNav-color)',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '100%',
          scrollbarWidth: 'none',
          width: 'var(--MobileNav-width)',
          zIndex: 'var(--MobileNav-zIndex)',
          '&::-webkit-scrollbar': { display: 'none' },
        },
      }}
      onClose={onClose}
      open={open}
    >
      <Box component="nav" sx={{ flex: "1 1 auto", p: "12px" }}>
        {renderNavItems({ pathname, session: session })}
      </Box>
    </Drawer>
  );
};

export const DesktopNav = (session: { session: Session | null }) => {
  return (
    <Box sx={sx}>
      <SideNav session={session.session} />
    </Box>
  );
};

const SideNav = (session: { session: Session | null }) => {
  const pathname = usePathname();

  return (
    <>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box
          component={RouterLink}
          href={Path("overview").href}
          sx={{ display: "inline-flex", textDecoration: "none" }}
        >
          <Logo />
        </Box>
      </Stack>
      <Box component="nav" sx={{ flex: "1 1 auto", p: "12px" }}>
        {renderNavItems({ pathname, session: session.session })}
      </Box>
      <Divider sx={{ borderColor: "var(--mui-palette-neutral-700)" }} />
    </>
  );
};

function renderNavItems({
  pathname,
  session,
}: {
  pathname: string;
  session: Session | null;
}): React.JSX.Element {
  const items = Paths.filter(path => !path.disableNav);
  const userPermission = session?.user?.permission;

  const children = items.reduce(
    (acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
      const { key, somePermissions , ...item} = curr;
      const userPermBit = userPermission ? BigInt(userPermission) : 0n;
      if (somePermissions && !userPermission) return acc;

      const hasSomePermissions = somePermissions?.some(permission => {
        return hasPermission(userPermBit, permission);
      });

      if (!hasSomePermissions) return acc;
    acc.push(<NavItem key={key} pathname={pathname} {...item} />);
      return acc;
    },
    []
  );

  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: "none", m: 0, p: 0 }}>
      {children}
    </Stack>
  );
}

interface NavItemProps extends Omit<NavItemConfig, "items"> {
  pathname: string;
}

function NavItem({
  disabled,
  external,
  href,
  icon,
  matcher,
  pathname,
  title,
}: NavItemProps): React.JSX.Element {
  const active = isNavItemActive({
    disabled,
    external,
    href,
    matcher,
    pathname,
  });
  const Icon = icon ? icons[icon] : null;

  return (
    <li>
      <Box
        {...(href
          ? {
              component: external ? "a" : RouterLink,
              href,
              target: external ? "_blank" : undefined,
              rel: external ? "noreferrer" : undefined,
            }
          : { role: "button" })}
        sx={{
          alignItems: "center",
          borderRadius: 0.3,
          color: "var(--NavItem-color)",
          cursor: "pointer",
          display: "flex",
          flex: "0 0 auto",
          gap: 1,
          p: "6px 3px",
          position: "relative",
          textDecoration: "none",
          whiteSpace: "nowrap",
          transition: "0.1s background ease",
          ...(disabled && {
            bgcolor: "var(--NavItem-disabled-background)",
            color: "var(--NavItem-disabled-color)",
            cursor: "not-allowed",
          }),
          ...(active && {
            bgcolor: "var(--NavItem-active-background)",
            color: "var(--NavItem-active-color)",
          }),
        }}
      >
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            flex: "0 0 auto",
            opacity: active ? 1 : 0.4,
            mr: 0.5,
            ml: 0.5
          }}
        >
          {Icon ? <Icon /> : null}
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
            {title}
          </Typography>
        </Box>
      </Box>
    </li>
  );
}
