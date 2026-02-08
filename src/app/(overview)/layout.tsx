import OverviewSidebarItems from "@/config/Navbar/overview";
import OverviewNavbar from "@/layouts/Navbar/OverviewNavbar";
import DesktopSidebar from "@/layouts/Sidenav/components/DesktopSidebar";
import { getPermissionContext } from "@/libs/permission/getPermissionContext";
import { SidebarGlobalStyles } from "@/providers/LayoutProvider";
import PermissionProvider from "@/providers/PermissionProvider";
import StoreProvider from "@/providers/StoreProvider";
import { Box, Stack } from "@mui/material";

export default async function OverviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const permission = await getPermissionContext();

  return (
    <PermissionProvider
      globalPermissions={Array.from(permission.globalPermissions)}
      storePermissions={[]}
    >
      <StoreProvider>
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
          <DesktopSidebar items={OverviewSidebarItems} />
          <Box
            sx={{
              display: "flex",
              flex: "1 1 auto",
              flexDirection: "column",
              pl: { md: "var(--SideNav-width)" },
            }}
          >
            <OverviewNavbar />
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
      </StoreProvider>
    </PermissionProvider>
  );
}
