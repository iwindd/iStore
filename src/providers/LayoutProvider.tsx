"use client";
import { useAuth } from "@/hooks/use-auth";
import DesktopNav from "@/layouts/sidenav/DesktopNav";
import { Box, GlobalStyles, Stack } from "@mui/material";
import Breadcrumb from "../layouts/breadcrumb";
import { MainNav } from "../layouts/mainnav";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useAuth();

  if (!user) {
    return children;
  }

  return (
    <>
      <GlobalStyles
        styles={{
          body: {
            "--MainNav-height": "56px",
            "--MainNav-zIndex": 1000,
            "--SideNav-width": "280px",
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
        <DesktopNav />
        <Box
          sx={{
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
            pl: { lg: "var(--SideNav-width)" },
          }}
        >
          <MainNav />
          <Stack p={2} spacing={1}>
            <Breadcrumb />
            {children}
          </Stack>
        </Box>
      </Box>
    </>
  );
}
