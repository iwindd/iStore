import { Box, Container, GlobalStyles } from "@mui/material";
import { MainNav } from "../layouts/mainnav";
import Breadcrumb from "../layouts/breadcrumb";
import { Session } from "next-auth";
import { InterfaceProvider } from "./InterfaceProvider";
import DesktopNav from "@/layouts/sidenav/DesktopNav";

export default async function MainLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <InterfaceProvider>
      {session ? (
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
            <DesktopNav session={session} />
            <Box
              sx={{
                display: "flex",
                flex: "1 1 auto",
                flexDirection: "column",
                pl: { lg: "var(--SideNav-width)" },
              }}
            >
              <MainNav session={session} />
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
      ) : (
        children
      )}
    </InterfaceProvider>
  );
}
