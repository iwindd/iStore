"use client";
import OverviewSidebarItems from "@/config/Navbar/overview";
import { useAuth } from "@/hooks/use-auth";
import { usePopover } from "@/hooks/use-popover";
import MobileSidebar from "@/layouts/Sidenav/components/MobileSidebar";
import { MenuTwoTone } from "@mui/icons-material";
import {
  alpha,
  Avatar,
  Box,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { usePathname } from "next/navigation";
import * as React from "react";
import OverviewUserPopover from "./components/OverviewUserPopover";

const OverviewNavbar = () => {
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
            <Avatar ref={userPopover.anchorRef} sx={{ cursor: "pointer" }} />
          </Stack>
        </Stack>
      </Box>
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
    </React.Fragment>
  );
};

export default OverviewNavbar;
