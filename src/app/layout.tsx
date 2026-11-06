import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Suspense } from 'react';
import { VisitTracker } from '@/components/tracking/visit-tracker';
import { JsonLd } from '@/components/seo/json-ld';
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TITLE,
  SITE_TITLE_TEMPLATE,
  SITE_URL,
} from '@/lib/seo';
import './globals.css';

// 自托管等宽字体，保证数字/英文标识在各平台渲染一致
const jetbrainsMono = localFont({
  src: [
    { path: '../fonts/JetBrainsMono-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/JetBrainsMono-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/JetBrainsMono-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: SITE_TITLE_TEMPLATE,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'technology',
  classification: '物联网 / IoT / 智慧监测',
  applicationName: SITE_NAME,
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  alternates: {
    canonical: '/',
    languages: {
      'zh-CN': '/',
      en: '/',
      'x-default': '/',
    },
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'zh_CN',
    alternateLocale: ['en_US'],
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: '杉恩科技 - 物联网智慧监测系统',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/opengraph-image'],
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`dark ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        <JsonLd />
        {children}
        <Suspense fallback={null}>
          <VisitTracker />
        </Suspense>
      </body>
    </html>
  );
}
