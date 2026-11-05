import { type ReactNode } from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

// Constants
import { BRAND_NAME, SITE_URL } from '@/constants';

// Contexts
import { ToastProvider, SessionProvider } from '@/contexts';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: BRAND_NAME,
    template: `${BRAND_NAME} | %s`,
  },
  description: 'A personal finance management app to track wallets, transactions',
  icons: {
    icon: '/favicon.ico',
  },
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: BRAND_NAME,
    description: 'A personal finance management app to track wallets, transactions',
    siteName: BRAND_NAME,
    url: SITE_URL,
    type: 'website',
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => (
  <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
    <body className="min-h-full flex flex-col">
      <SessionProvider>
        <ToastProvider>{children}</ToastProvider>
      </SessionProvider>
    </body>
  </html>
);

export default RootLayout;
