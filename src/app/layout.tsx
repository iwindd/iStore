import { auth } from "@/auth";
import { InterfaceProvider } from "@/providers/InterfaceProvider";
import LocalizationProvider from "@/providers/LocalizationProvider";
import QueryProvider from "@/providers/QueryProvider";
import SessionProvider from "@/providers/SessionProvder";
import "@/styles/global.css";
import ThemeRegistry from "@/styles/ThemeRegistry";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
          <LocalizationProvider>
            <ThemeRegistry>
              <QueryProvider>
                <SessionProvider session={session}>
                  <InterfaceProvider>{children}</InterfaceProvider>
                </SessionProvider>
              </QueryProvider>
            </ThemeRegistry>
          </LocalizationProvider>
        </NextIntlClientProvider>

        {/* Vercel */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
