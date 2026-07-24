import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '杉恩科技 | 物联网智慧监测系统',
  description:
    '杉恩科技专注于物联网系统研发，提供水库、森林、国土、环境等领域的全方位智慧监测解决方案。',
  keywords: [
    '杉恩科技',
    '物联网',
    'IoT',
    '水库监测',
    '森林监测',
    '国土监测',
    '环境监测',
    '智慧监测',
    '传感器',
    '数据采集',
  ],
  authors: [{ name: '杉恩科技' }],
  openGraph: {
    title: '杉恩科技 | 物联网智慧监测系统',
    description:
      '专注于物联网系统研发，提供水库、森林、国土、环境等领域的全方位智慧监测解决方案。',
    type: 'website',
    locale: 'zh_CN',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
