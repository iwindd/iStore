import { getServerSession } from "@/libs/session";
import MainLayout from "@/providers/LayoutProvider";

/* PROVIDERS */
import LocalizationProvider from "@/providers/LocalizationProvider";
import QueryProvider from "@/providers/QueryProvider";
import RecoilProvider from "@/providers/RecoilProvider";
import SessionProvider from "@/providers/SessionProvder";

/* THEME */
import { InterfaceProvider } from "@/providers/InterfaceProvider";
import ThemeRegistry from "@/styles/ThemeRegistry";

export const metadata = {
  title: "iStore",
  description: "",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body>
        <RecoilProvider>
          <LocalizationProvider>
            <ThemeRegistry>
              <SessionProvider session={session}>
                <QueryProvider>
                  <InterfaceProvider>
                    <MainLayout>{children}</MainLayout>
                  </InterfaceProvider>
                </QueryProvider>
              </SessionProvider>
            </ThemeRegistry>
          </LocalizationProvider>
        </RecoilProvider>
      </body>
    </html>
  );
}
