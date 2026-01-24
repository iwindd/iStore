import { auth } from "@/auth";
import { InterfaceProvider } from "@/providers/InterfaceProvider";
import LocalizationProvider from "@/providers/LocalizationProvider";
import QueryProvider from "@/providers/QueryProvider";
import SessionProvider from "@/providers/SessionProvder";
import StoreProvider from "@/providers/StoreProvider";
import "@/styles/global.css";
import ThemeRegistry from "@/styles/ThemeRegistry";
import { NextIntlClientProvider } from "next-intl";

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
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <NextIntlClientProvider>
          <StoreProvider>
            <LocalizationProvider>
              <ThemeRegistry>
                <SessionProvider session={session}>
                  <QueryProvider>
                    <InterfaceProvider>{children}</InterfaceProvider>
                  </QueryProvider>
                </SessionProvider>
              </ThemeRegistry>
            </LocalizationProvider>
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
