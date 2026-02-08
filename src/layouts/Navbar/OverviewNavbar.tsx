"use client";
import OverviewSidebarItems from "@/config/Navbar/overview";
import { useAuth } from "@/hooks/use-auth";
import { usePopover } from "@/hooks/use-popover";
import MobileSidebar from "@/layouts/Sidenav/components/MobileSidebar";
import { MenuTwoTone, Settings } from "@mui/icons-material";
import { Avatar, IconButton, Stack, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import * as React from "react";
import LayoutSettingsDrawer from "./components/LayoutSettingsDrawer";
import OverviewUserPopover from "./components/OverviewUserPopover";
import NavbarContainer from "./NavbarContainer";

const OverviewNavbar = () => {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const [openSettings, setOpenSettings] = React.useState<boolean>(false);
  const { user } = useAuth();
  const userPopover = usePopover<HTMLDivElement>();
  const pathname = usePathname();
  React.useEffect(() => setOpenNav(false), [pathname]);

  return (
    <React.Fragment>
      <NavbarContainer>
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
            <Stack spacing={0} direction={"row"} alignItems={"center"}></Stack>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton onClick={() => setOpenSettings(true)}>
              <Settings />
            </IconButton>
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
                  {user?.displayName}
                </Typography>
                <Typography align="right" variant="caption">
                  {user?.email}
                </Typography>
              </Stack>
              <Avatar ref={userPopover.anchorRef} sx={{ cursor: "pointer" }} />
            </Stack>
          </Stack>
        </Stack>
      </NavbarContainer>
      <OverviewUserPopover
        anchorEl={userPopover.anchorRef.current}
        onClose={userPopover.handleClose}
        open={userPopover.open}
      />
      <MobileSidebar
        items={OverviewSidebarItems}
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />
      <LayoutSettingsDrawer
        open={openSettings}
        onClose={() => setOpenSettings(false)}
      />
    </React.Fragment>
  );
};

export default OverviewNavbar;
