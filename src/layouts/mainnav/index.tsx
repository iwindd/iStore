"use client";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import * as React from "react";

import { usePopover } from "@/hooks/use-popover";

import { useAuth } from "@/hooks/use-auth";
import { MenuTwoTone } from "@mui/icons-material";
import { alpha, Typography, useTheme } from "@mui/material";
import { usePathname } from "next/navigation";
import Breadcrumb from "../breadcrumb";
import UserPopover from "../popover";
import MobileNav from "../sidenav/MobileNav";

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const { user } = useAuth();
  const theme = useTheme();
  const userPopover = usePopover<HTMLDivElement>();
  const pathname = usePathname();
  React.useEffect(() => setOpenNav(false), [pathname]);

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          backgroundColor: `${alpha(theme.palette.background.paper, 0.8)}`,
          backdropFilter: "blur(20px)",
          position: "sticky",
          top: 0,
          zIndex: "var(--mui-zIndex-appBar)",
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: "64px",
            px: 2,
          }}
        >
          <Stack sx={{ alignItems: "center" }} direction="row" spacing={2}>
            <IconButton
              sx={{ display: { lg: "none" } }}
              onClick={(): void => {
                setOpenNav(true);
              }}
            >
              <MenuTwoTone />
            </IconButton>
            <Breadcrumb />
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            onClick={userPopover.handleOpen}
            alignItems={"center"}
            ref={userPopover.anchorRef}
            sx={{ cursor: "pointer" }}
          >
            <Stack sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography align="right" variant="subtitle2">
                {user?.session.user.name}
              </Typography>
              <Typography align="right" variant="caption">
                {user?.session.user.email}
              </Typography>
            </Stack>
            <Avatar
              onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              sx={{ cursor: "pointer" }}
            />
          </Stack>
        </Stack>
      </Box>
      <UserPopover
        anchorEl={userPopover.anchorRef.current}
        onClose={userPopover.handleClose}
        open={userPopover.open}
      />
      <MobileNav
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />
    </React.Fragment>
  );
}
