import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Navbar } from '@/components/blocks/Navbar';
import { Footer } from '@/components/blocks/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  DEFAULT_KEYWORDS,
  organizationJsonLd,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from '@/lib/seo';

const manrope = localFont({
  src: './fonts/manrope-variable.ttf',
  weight: '200 800',
  style: 'normal',
  display: 'swap',
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s · Delta Prime',
  },
  description: SITE_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: '/',
  },
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  openGraph: {
    type: 'website',
    locale: SITE_LOCALE,
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F7F8F8' },
    { media: '(prefers-color-scheme: dark)', color: '#0E1416' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // suppressHydrationWarning: расширения браузера дописывают атрибуты (data-yd-*) в <html> на клиенте — это не наш рассинхрон.
  return (
    <html lang="ru" data-theme="light" className={manrope.variable} suppressHydrationWarning>
      <body className="font-sans antialiased flex min-h-dvh flex-col">
        <JsonLd data={organizationJsonLd()} />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
