import { InterfaceProvider } from "@/providers/InterfaceProvider";
import MainLayout from "@/providers/LayoutProvider";
import LocalizationProvider from "@/providers/LocalizationProvider";
import QueryProvider from "@/providers/QueryProvider";
import SessionProvider from "@/providers/SessionProvder";
import StoreProvider from "@/providers/StoreProvider";
import ThemeRegistry from "@/styles/ThemeRegistry";

export const metadata = {
  title: "iStore",
  description: "",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <LocalizationProvider>
            <ThemeRegistry>
              <SessionProvider session={null}>
                <QueryProvider>
                  <InterfaceProvider>
                    <MainLayout>{children}</MainLayout>
                  </InterfaceProvider>
                </QueryProvider>
              </SessionProvider>
            </ThemeRegistry>
          </LocalizationProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
