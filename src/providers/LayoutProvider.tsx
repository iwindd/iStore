"use client";
import { useAuth } from "@/hooks/use-auth";
import DesktopNav from "@/layouts/sidenav/DesktopNav";
import { Box, Container, GlobalStyles } from "@mui/material";
import Breadcrumb from "../layouts/breadcrumb";
import { MainNav } from "../layouts/mainnav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          <main>
            <Container maxWidth="xl" sx={{ py: 2 }}>
              <Breadcrumb />
            </Container>
            <Container maxWidth="xl" sx={{ py: "10px" }}>
              {children}
            </Container>
          </main>
        </Box>
      </Box>
    </>
  );
}
