"use client";
import OverviewNavbarItems from "@/config/Navbar/overview";
import DesktopNav from "@/layouts/sidenav/DesktopNav";
import { Box, GlobalStyles, Stack } from "@mui/material";
import { OverviewNav } from "./components/OverviewNav";

export default function OverviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <GlobalStyles
        styles={{
          body: {
            "--MainNav-height": "56px",
            "--MainNav-zIndex": 1000,
            "--SideNav-width": "300px",
            "--SideNav-zIndex": 1100,
            "--MobileNav-width": "320px",
            "--MobileNav-zIndex": 1100,
          },
        }}
      />
      <Box
        sx={{
          bgcolor: "var(--mui-palette-background-default)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          minHeight: "100%",
        }}
      >
        <DesktopNav items={OverviewNavbarItems} />
        <Box
          sx={{
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
            pl: { md: "var(--SideNav-width)" },
          }}
        >
          <OverviewNav />
          <Stack
            px={{
              xs: 2,
              sm: 3,
              md: 4,
              lg: 5,
              xl: 8,
            }}
            mt={{
              xs: 1,
            }}
            spacing={1}
          >
            {children}
          </Stack>
        </Box>
      </Box>
    </>
  );
}
