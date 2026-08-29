import {
  ORG,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from '@/lib/seo';

/** Organization + WebSite + LocalBusiness JSON-LD for search engines */
export function JsonLd() {
  const organization = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: ORG.name,
    legalName: ORG.legalName,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/icon`,
    },
    email: ORG.email,
    telephone: [ORG.phone, ORG.phoneAlt],
    address: {
      '@type': 'PostalAddress',
      streetAddress: ORG.address.streetAddress,
      addressLocality: ORG.address.addressLocality,
      addressRegion: ORG.address.addressRegion,
      addressCountry: ORG.address.addressCountry,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: ORG.phone,
        contactType: 'sales',
        areaServed: 'CN',
        availableLanguage: ['zh-CN', 'en'],
      },
      {
        '@type': 'ContactPoint',
        telephone: ORG.phoneAlt,
        contactType: 'technical support',
        areaServed: 'CN',
        availableLanguage: ['zh-CN', 'en'],
      },
    ],
    ...(ORG.sameAs.length > 0 ? { sameAs: ORG.sameAs } : {}),
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: ['zh-CN', 'en'],
  };

  const localBusiness = {
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#localbusiness`,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    telephone: ORG.phone,
    email: ORG.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: ORG.address.streetAddress,
      addressLocality: ORG.address.addressLocality,
      addressRegion: ORG.address.addressRegion,
      addressCountry: ORG.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 22.5405,
      longitude: 114.0545,
    },
    areaServed: {
      '@type': 'Country',
      name: 'China',
    },
    knowsAbout: [
      '物联网',
      '水库监测',
      '森林监测',
      '国土监测',
      '环境监测',
      'IoT',
      '智慧监测系统',
    ],
    parentOrganization: { '@id': `${SITE_URL}/#organization` },
  };

  const services = [
    {
      '@type': 'Service',
      name: '水库安全监测',
      description:
        '实时监测水库水位、流量、坝体变形等关键指标，构建水利感知网络，支撑防汛预警与水资源调度。',
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: 'CN',
      serviceType: '水库监测 / Reservoir Monitoring',
    },
    {
      '@type': 'Service',
      name: '森林资源监测',
      description:
        '多维传感网络监测森林火险、病虫害与生态变化，实现林区全天候智能监控。',
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: 'CN',
      serviceType: '森林监测 / Forest Monitoring',
    },
    {
      '@type': 'Service',
      name: '国土资源监测',
      description:
        '遥感与地面传感融合，对土地利用、地质灾害、矿产资源进行精准监测与分析。',
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: 'CN',
      serviceType: '国土监测 / Land Monitoring',
    },
    {
      '@type': 'Service',
      name: '生态环境监测',
      description:
        '大气、水质、土壤多维度环境监测体系，实时采集分析环境数据。',
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: 'CN',
      serviceType: '环境监测 / Environment Monitoring',
    },
  ];

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [organization, website, localBusiness, ...services],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
