"use client";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import * as React from "react";

import { usePopover } from "@/hooks/use-popover";

import StoreSidebarItems from "@/config/Navbar/store";
import { useAuth } from "@/hooks/use-auth";
import { MenuTwoTone } from "@mui/icons-material";
import { alpha, Typography, useTheme } from "@mui/material";
import { usePathname } from "next/navigation";
import MobileSidebar from "../Sidenav/components/MobileSidebar";
import AppBreadcrumb from "./components/AppBreadcrumb";
import StoreSelector from "./components/StoreSwitcher";
import StoreUserPopover from "./components/StoreUserPopover";

const StoreNavbar = () => {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const { user } = useAuth();
  const theme = useTheme();
  const storeUserPopover = usePopover<HTMLDivElement>();
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
            px: {
              xs: 1,
              md: 2,
              xl: 3,
            },
          }}
        >
          <Stack sx={{ alignItems: "center" }} direction="row" spacing={2}>
            <IconButton
              sx={{ display: { md: "none" } }}
              onClick={(): void => {
                setOpenNav(true);
              }}
            >
              <MenuTwoTone />
            </IconButton>
            <Stack spacing={0} direction={"row"} alignItems={"center"}>
              <StoreSelector />
              <AppBreadcrumb />
            </Stack>
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            onClick={storeUserPopover.handleOpen}
            alignItems={"center"}
            sx={{ cursor: "pointer" }}
          >
            <Stack sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography align="right" variant="subtitle2">
                {user?.displayName}
              </Typography>
              <Typography align="right" variant="caption">
                {user?.email}
              </Typography>
            </Stack>
            <Avatar
              sx={{ cursor: "pointer" }}
              ref={storeUserPopover.anchorRef}
            />
          </Stack>
        </Stack>
      </Box>
      <StoreUserPopover
        anchorEl={storeUserPopover.anchorRef.current}
        onClose={storeUserPopover.handleClose}
        open={storeUserPopover.open}
      />
      <MobileSidebar
        items={StoreSidebarItems}
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />
    </React.Fragment>
  );
};

export default StoreNavbar;
