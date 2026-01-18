"use client";
import { useAuth } from "@/hooks/use-auth";
import DesktopNav from "@/layouts/sidenav/DesktopNav";
import { Box, GlobalStyles, Stack } from "@mui/material";
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
        <DesktopNav />
        <Box
          sx={{
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
            pl: { md: "var(--SideNav-width)" },
          }}
        >
          <MainNav />
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
