"use client";
import StoreSidebarItems from "@/config/Navbar/store";
import { useAppSelector } from "@/hooks";
import { useAuth } from "@/hooks/use-auth";
import StoreNavbar from "@/layouts/Navbar/StoreNavbar";
import DesktopSidebar from "@/layouts/Sidenav/components/DesktopSidebar";
import { Box, GlobalStyles, Stack } from "@mui/material";

function LayoutContent({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SidebarGlobalStyles />
      <Box
        sx={{
          bgcolor: "var(--mui-palette-background-default)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          minHeight: "100%",
        }}
      >
        <DesktopSidebar items={StoreSidebarItems} />
        <Box
          sx={{
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
            pl: { md: "var(--SideNav-width)" },
            transition: "padding-left 0.3s ease",
          }}
        >
          <StoreNavbar />
          <Stack
            px={{
              xs: 2,
              sm: 3,
              md: 4,
              lg: 5,
              xl: 8,
            }}
            pb={4}
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

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useAuth();

  if (!user) {
    return children;
  }

  return <LayoutContent>{children}</LayoutContent>;
}

export const SidebarGlobalStyles = () => {
  const navbarVariant = useAppSelector((state) => state.ui.navbarVariant);
  const isCollapsed = navbarVariant === "collapse";

  return (
    <GlobalStyles
      styles={{
        body: {
          "--MainNav-height": "56px",
          "--MainNav-zIndex": 1000,
          "--SideNav-width": isCollapsed ? "80px" : "300px",
          "--SideNav-zIndex": 1200,
          "--MobileNav-width": "320px",
          "--MobileNav-zIndex": 1100,
        },
      }}
    />
  );
};
