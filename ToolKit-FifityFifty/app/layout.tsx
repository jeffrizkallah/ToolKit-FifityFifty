import type { Metadata } from 'next';
import './globals.css';

/**
 * Root Layout
 * 
 * This is the root layout that wraps all pages.
 * It's minimal by design - locale-specific layouts are in app/[locale]/layout.tsx
 */

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    template: '%s | FiftyFifty ToolKit',
    default: 'FiftyFifty ToolKit',
  },
  description: 'Building sustainable communities through social responsibility. A comprehensive methodology and learning platform for social entrepreneurs and community leaders in the Arab world.',
  keywords: ['FiftyFifty', 'ToolKit', 'Social Responsibility', 'Community', 'Sustainability', 'Social Entrepreneurs', 'Arab World', 'Community Leadership', 'Social Impact'],
  authors: [{ name: 'FiftyFifty' }],
  creator: 'FiftyFifty',
  publisher: 'FiftyFifty',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ar_SA',
    siteName: 'FiftyFifty ToolKit',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://toolkit.fiftyfifty.org',
    title: 'FiftyFifty ToolKit',
    description: 'Building sustainable communities through social responsibility',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FiftyFifty ToolKit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@fiftyfifty',
    creator: '@fiftyfifty',
    title: 'FiftyFifty ToolKit',
    description: 'Building sustainable communities through social responsibility',
    images: ['/twitter-image.png'],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'ar': '/ar',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

