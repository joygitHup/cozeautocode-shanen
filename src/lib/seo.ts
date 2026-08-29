/**
 * 站点 SEO 基础配置。
 * 生产环境务必设置 NEXT_PUBLIC_SITE_URL（如 https://www.your-domain.com）
 */
function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;

  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProd) return `https://${vercelProd.replace(/\/$/, '')}`;

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl.replace(/\/$/, '')}`;

  // 本地开发回退；上线前请配置 NEXT_PUBLIC_SITE_URL
  return 'http://localhost:5000';
}

export const SITE_URL = resolveSiteUrl();

export const SITE_NAME = '杉恩科技';
export const SITE_NAME_EN = 'Shanen Tech';

export const SITE_TITLE = '杉恩科技 | 物联网智慧监测系统 · 水库森林国土环境';
export const SITE_TITLE_TEMPLATE = '%s | 杉恩科技';

export const SITE_DESCRIPTION =
  '杉恩科技（深圳）专注物联网（IoT）系统研发，提供水库安全监测、森林火险监测、国土资源监测、生态环境监测等智慧监测解决方案，服务水利、林业、自然资源与环保领域。';

export const SITE_KEYWORDS = [
  '杉恩科技',
  '物联网',
  'IoT',
  '物联网监测系统',
  '智慧监测',
  '水库监测',
  '水库安全监测',
  '森林监测',
  '森林火险监测',
  '国土监测',
  '国土资源监测',
  '环境监测',
  '生态环境监测',
  '传感器网络',
  '数据采集',
  '边缘计算',
  '智慧水利',
  '智慧林业',
  '深圳物联网公司',
  'AIoT',
];

export const ORG = {
  name: SITE_NAME,
  legalName: '杉恩科技',
  email: 'shanenservice@163.com',
  phone: '+86-132-6542-4932',
  phoneAlt: '+86-755-8320-9287',
  address: {
    streetAddress: '车公庙天祥大厦4楼',
    addressLocality: '深圳市',
    addressRegion: '广东省',
    addressCountry: 'CN',
  },
  sameAs: [] as string[],
};
