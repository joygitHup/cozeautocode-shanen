import type { Metadata } from 'next';
import HomePage from '@/components/home-page';
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
};

/** 服务端页面：保证元数据与首屏 HTML 可被搜索引擎抓取 */
export default function Home() {
  return <HomePage />;
}
