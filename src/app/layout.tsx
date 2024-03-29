import './globals.css';
import { getServerSession } from '@/libs/session';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

/* LAYOUYS */
import Authentication from './authentication';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';

// PROVIDERS
import { InterfaceProvider } from './providers/InterfaceProvider';
import SessionProvider from './providers/SessionProvider';
import QueryProvider from './providers/QueryProvider';
import { StorageProvider } from '@/storage';

/* COMPONENTS */
import Navbar from './components/navbar';
import { CssBaseline } from '@mui/material';
import LocalizationProvider from './providers/LocalizationProvider';

export const metadata = {
  title: 'iStore',
  description: '',
  icons: {
    icon: [
      '/favicon.ico?v=1'
    ],
    apple: [
      '/apple-touch-icon.png?v=1',
    ],
    shortcut: [
      '/apple-touch-icon.png',
    ]
  },
  manifest: "/site.webmanifest"
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body>
        <StorageProvider>
          <LocalizationProvider >
            <InterfaceProvider>
              <ThemeRegistry>
                <CssBaseline />
                <SessionProvider session={session}>
                  <QueryProvider>
                    {session ? (
                      <Navbar>
                        {children}
                      </Navbar>
                    ) : (
                      <Authentication />
                    )}
                  </QueryProvider>
                </SessionProvider>
              </ThemeRegistry>
            </InterfaceProvider>
          </LocalizationProvider>
        </StorageProvider>
      </body>
    </html>
  );
}
