// Force clean deploy - favicon cache fix updated 2025-06-24 8:07 PM
import { ThemeProvider } from '@/components/home/theme-provider';
import { siteConfig } from '@/lib/site';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import './animation.css';
import { Providers } from './providers';
import { AppInitializer } from '@/components/app-initializer';
import { Toaster } from '@/components/ui/sonner';
// import { WalletContextProvider } from '@/providers/WalletContextProvider';
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Script from 'next/script';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: 'black',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description:
    'The AI that understands what you\'re building',
  keywords: [
    'AI',
    'artificial intelligence',
    'browser automation',
    'web scraping',
    'file management',
    'AI assistant',
    'open source',
    'research',
    'data analysis',
  ],
  authors: [{ name: 'BuildWithSin Team', url: 'https://buildwithsin.com' }],
  creator:
    'BuildWithSin Team',
  publisher:
    'BuildWithSin Team',
  category: 'Technology',
  applicationName: 'BuildWithSin',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: 'BuildWithSin - The AI that understands what you\'re building',
    description:
      'The AI that understands what you\'re building',
    url: siteConfig.url,
    siteName: 'BuildWithSin',
    images: [
      {
        url: '/banner.png',
        width: 1200,
        height: 630,
        alt: 'BuildWithSin - The AI that understands what you\'re building',
        type: 'image/png',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BuildWithSin - The AI that understands what you\'re building',
    description:
      'The AI that understands what you\'re building',
    creator: '@BuildWithSin',
    site: '@BuildWithSin',
    images: [
      {
        url: '/banner.png',
        width: 1200,
        height: 630,
        alt: 'BuildWithSin - The AI that understands what you\'re building',
      },
    ],
  },
  icons: {
    icon: { url: '/buildwithsin-symbol-favicon.ico?v=2', sizes: 'any' },
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: siteConfig.url,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-PCHSN4M2');`}
        </Script>
        <Script async src="https://cdn.tolt.io/tolt.js" data-tolt={process.env.NEXT_PUBLIC_TOLT_REFERRAL_ID}></Script>
        <Script src="/vanilla-tilt.js"></Script>
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-white bg-gradient-to-b from-white to-slate-50 min-h-screen`}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PCHSN4M2"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Providers>
            {/* WalletContextProvider temporarily disabled for deployment */}
            {/* <WalletContextProvider> */}
              <AppInitializer>{children}</AppInitializer>
            {/* </WalletContextProvider> */}
            <Toaster />
          </Providers>
          <Analytics />
          <GoogleAnalytics gaId="G-6ETJFB3PT3" />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
