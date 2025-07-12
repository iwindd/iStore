"use client";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";

import { usePopover } from "@/hooks/use-popover";

import { UserPopover } from "../user-popover";
import { MenuTwoTone } from "@mui/icons-material";
import { Session } from "next-auth";
import { Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import MobileNav from "../sidenav/MobileNav";

export function MainNav({
  session,
}: {
  session: Session | null;
}): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);

  const userPopover = usePopover<HTMLDivElement>();
  const pathname = usePathname();
  React.useEffect(() => (setOpenNav(false)), [pathname]);

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: "1px solid var(--mui-palette-divider)",
          backgroundColor: "var(--mui-palette-background-paper)",
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
          </Stack>
          <Stack 
            direction="row" 
            spacing={2}
            onClick={userPopover.handleOpen}
            alignItems={"center"}
            ref={userPopover.anchorRef}
            sx={{ cursor: "pointer" }}
          >
            <Stack>
              <Typography align="right" variant="subtitle2">{session?.user.name}</Typography>
              <Typography align="right" variant="caption">{session?.user.email}</Typography>
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
        session={session}
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />
    </React.Fragment>
  );
}
