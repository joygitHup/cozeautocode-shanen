export type Locale = 'zh' | 'en';

export const translations = {
  zh: {
    brand: '杉恩科技',
    nav: {
      home: '首页',
      domains: '业务领域',
      stats: '技术实力',
      about: '关于我们',
      contact: '联系我们',
    },
    langSwitch: 'EN',
    langSwitchAria: '切换到英文',
    navAria: '主导航',
    menuAria: '打开或关闭导航菜单',
    hero: {
      status: 'IoT System Online',
      title1: '万物互联',
      title2: '智慧感知',
      description:
        '杉恩科技专注于物联网系统研发，以精密传感与智能算法，守护每一片水库、森林、国土与环境',
      indicators: [
        { value: '4', unit: '大', label: '核心领域' },
        { value: '1000', unit: '+', label: '监测站点' },
        { value: '99.9', unit: '%', label: '系统可用率' },
        { value: '7x24', unit: '', label: '不间断运行' },
      ],
      ctaDomains: '探索业务领域',
      ctaContact: '联系我们',
    },
    domains: {
      eyebrow: 'Business Domains',
      title: '四大核心领域',
      subtitle: '深耕物联网技术研发，为自然资源与生态环境提供全方位智慧监测解决方案',
      items: [
        {
          title: '水库监测',
          subtitle: 'Reservoir Monitoring',
          description:
            '实时监测水库水位、流量、坝体变形等关键指标，构建覆盖全域的水利感知网络，为防汛预警与水资源调度提供数据支撑。',
          features: ['水位实时监测', '坝体安全预警', '流量数据分析', '防汛指挥调度'],
        },
        {
          title: '森林监测',
          subtitle: 'Forest Monitoring',
          description:
            '通过多维传感网络监测森林火险、病虫害、生态变化，实现林区全天候智能监控，守护绿色生态安全屏障。',
          features: ['火险早期预警', '病虫害识别', '生物多样性监测', '碳汇数据采集'],
        },
        {
          title: '国土监测',
          subtitle: 'Land Monitoring',
          description:
            '运用遥感与地面传感融合技术，对土地利用、地质灾害、矿产资源进行精准监测与智能分析。',
          features: ['土地利用分析', '地质灾害预警', '矿山安全监测', '测绘数据管理'],
        },
        {
          title: '环境监测',
          subtitle: 'Environment Monitoring',
          description:
            '构建大气、水质、土壤多维度环境监测体系，实时采集分析环境数据，助力生态文明与可持续发展。',
          features: ['空气质量监测', '水质分析预警', '土壤污染检测', '噪声振动监测'],
        },
      ],
    },
    stats: {
      eyebrow: 'Technical Strength',
      title: '技术实力',
      subtitle: '以技术创新驱动行业发展，用数据连接万物',
      items: [
        { value: 50, suffix: '+', label: '研发团队', prefix: '' },
        { value: 100, suffix: '+', label: '项目案例', prefix: '' },
        { value: 50, suffix: '+', label: '城市覆盖', prefix: '' },
        { value: 10000, suffix: '+', label: '在线设备', prefix: '' },
      ],
      advantages: [
        {
          title: '自研核心算法',
          description:
            '自主研发的数据处理与智能分析算法，支持边缘计算与云端协同，实现毫秒级响应。',
        },
        {
          title: '全域感知网络',
          description:
            '支持 LoRa、NB-IoT、4G/5G 等多协议接入，构建广覆盖、低功耗的传感网络。',
        },
        {
          title: '高可靠架构',
          description:
            '分布式微服务架构，多活容灾设计，系统可用率达 99.9%，数据安全有保障。',
        },
        {
          title: '智能决策平台',
          description:
            '融合大数据与 AI 分析能力，提供可视化决策支持，从数据到洞察一步到位。',
        },
      ],
    },
    about: {
      eyebrow: 'About Us',
      title: '关于杉恩',
      subtitle: '以科技之力，守护自然之美',
      p1: '杉恩科技成立于 2019 年，是一家专注于物联网系统研发的高新技术企业。公司以「万物互联，智慧感知」为使命，致力于通过先进的传感器技术、数据处理算法和智能分析平台，为水库安全、森林保护、国土资源、生态环境等关键领域提供全方位的监测解决方案。',
      p2: '经过五年的技术积累与行业深耕，杉恩科技已发展成为国内物联网监测领域的领先企业，业务覆盖全国 50 余个城市，服务客户涵盖水利、林业、自然资源、生态环境等政府部门及企事业单位。',
      values: [
        { label: '使命', text: '万物互联 智慧感知' },
        { label: '愿景', text: '成为全球领先的 IoT 方案商' },
        { label: '价值观', text: '精准 创新 担当 共赢' },
      ],
      milestones: [
        { year: '2019', event: '公司成立，聚焦物联网技术研发' },
        { year: '2020', event: '首个水库安全监测系统上线运行' },
        { year: '2021', event: '业务拓展至森林、国土监测领域' },
        { year: '2022', event: '物联网监测平台接入设备突破 5000 台' },
        { year: '2023', event: '环境监测平台覆盖全国 50+ 城市' },
        { year: '2024', event: '新一代 AIoT 平台发布，万级设备接入' },
      ],
    },
    contact: {
      eyebrow: 'Contact Us',
      title: '联系我们',
      subtitle: '期待与您携手，共建智慧物联新未来',
      addressLabel: '公司地址',
      address: '深圳市福田区车公庙天祥大厦4楼',
      phoneLabel: '联系电话',
      phoneBiz: '业务咨询：13265424932',
      phoneTech: '技术交流：0755-83209287',
      emailLabel: '电子邮箱',
      formTitle: '在线咨询',
      successTitle: '提交成功',
      successDesc: '我们将在 1 个工作日内与您联系',
      errorTitle: '提交失败',
      errorDesc: '请稍后重试或拨打电话联系我们',
      name: '姓名',
      namePlaceholder: '请输入您的姓名',
      phone: '电话',
      phonePlaceholder: '请输入联系电话',
      company: '公司名称',
      companyPlaceholder: '请输入公司名称',
      domain: '需求领域',
      domainPlaceholder: '请选择需求领域',
      domainOptions: [
        { value: 'reservoir', label: '水库监测' },
        { value: 'forest', label: '森林监测' },
        { value: 'land', label: '国土监测' },
        { value: 'environment', label: '环境监测' },
        { value: 'other', label: '其他' },
      ],
      message: '需求描述',
      messagePlaceholder: '请简要描述您的需求',
      submit: '提交咨询',
      submitting: '提交中...',
    },
    footer: {
      tagline1: '万物互联，智慧感知。',
      tagline2: '专注于物联网系统研发与创新应用。',
      solutions: '解决方案',
      solutionItems: ['水库安全监测', '森林资源监测', '国土资源监测', '生态环境监测'],
      company: '关于公司',
      companyItems: ['公司介绍', '发展历程', '技术实力', '加入我们'],
      contact: '联系方式',
      phoneBiz: '业务咨询：13265424932',
      phoneTech: '技术交流：0755-83209287',
      email: '邮箱：shanenservice@163.com',
      address: '地址：深圳市福田区车公庙天祥大厦4楼',
      copyright: '© 2024 杉恩科技 版权所有',
      privacy: '隐私政策',
      terms: '服务条款',
      sitemap: '网站地图',
    },
  },
  en: {
    brand: 'Shanen Tech',
    nav: {
      home: 'Home',
      domains: 'Domains',
      stats: 'Technology',
      about: 'About',
      contact: 'Contact',
    },
    langSwitch: '中文',
    langSwitchAria: 'Switch to Chinese',
    navAria: 'Primary navigation',
    menuAria: 'Open or close navigation menu',
    hero: {
      status: 'IoT System Online',
      title1: 'Connecting Everything',
      title2: 'Sensing with Wisdom',
      description:
        'Shanen Tech specializes in IoT systems, using precision sensing and intelligent algorithms to safeguard reservoirs, forests, land, and the environment.',
      indicators: [
        { value: '4', unit: '', label: 'Core Domains' },
        { value: '1000', unit: '+', label: 'Monitoring Sites' },
        { value: '99.9', unit: '%', label: 'System Uptime' },
        { value: '7x24', unit: '', label: 'Continuous Ops' },
      ],
      ctaDomains: 'Explore Domains',
      ctaContact: 'Contact Us',
    },
    domains: {
      eyebrow: 'Business Domains',
      title: 'Four Core Domains',
      subtitle:
        'Deep expertise in IoT R&D, delivering end-to-end smart monitoring for natural resources and the environment.',
      items: [
        {
          title: 'Reservoir Monitoring',
          subtitle: 'Reservoir Monitoring',
          description:
            'Real-time monitoring of water levels, flow, and dam deformation—building a full-coverage hydraulic sensing network for flood warning and water resource scheduling.',
          features: [
            'Real-time water levels',
            'Dam safety alerts',
            'Flow data analysis',
            'Flood command & control',
          ],
        },
        {
          title: 'Forest Monitoring',
          subtitle: 'Forest Monitoring',
          description:
            'Multi-dimensional sensor networks track fire risk, pests, and ecological change for around-the-clock forest intelligence and green-barrier protection.',
          features: [
            'Early fire-risk warning',
            'Pest & disease detection',
            'Biodiversity monitoring',
            'Carbon sink data',
          ],
        },
        {
          title: 'Land Monitoring',
          subtitle: 'Land Monitoring',
          description:
            'Fusing remote sensing with ground sensors for precise monitoring and analysis of land use, geological hazards, and mineral resources.',
          features: [
            'Land-use analysis',
            'Geological hazard alerts',
            'Mine safety monitoring',
            'Survey data management',
          ],
        },
        {
          title: 'Environment Monitoring',
          subtitle: 'Environment Monitoring',
          description:
            'A multi-dimensional system for air, water, and soil—collecting and analyzing environmental data in real time to support ecological civilization.',
          features: [
            'Air quality monitoring',
            'Water quality alerts',
            'Soil pollution testing',
            'Noise & vibration',
          ],
        },
      ],
    },
    stats: {
      eyebrow: 'Technical Strength',
      title: 'Technical Strength',
      subtitle: 'Innovation drives the industry; data connects everything.',
      items: [
        { value: 50, suffix: '+', label: 'R&D Team', prefix: '' },
        { value: 100, suffix: '+', label: 'Projects', prefix: '' },
        { value: 50, suffix: '+', label: 'Cities Covered', prefix: '' },
        { value: 10000, suffix: '+', label: 'Online Devices', prefix: '' },
      ],
      advantages: [
        {
          title: 'Proprietary Algorithms',
          description:
            'In-house data processing and analytics with edge–cloud collaboration for millisecond-level response.',
        },
        {
          title: 'Full-Coverage Sensing',
          description:
            'LoRa, NB-IoT, 4G/5G and more—wide coverage, low-power sensor networks.',
        },
        {
          title: 'High-Reliability Stack',
          description:
            'Distributed microservices with multi-active disaster recovery; 99.9% uptime and secured data.',
        },
        {
          title: 'Intelligent Decision Hub',
          description:
            'Big data and AI analytics with visual decision support—from data to insight in one step.',
        },
      ],
    },
    about: {
      eyebrow: 'About Us',
      title: 'About Shanen',
      subtitle: 'Technology that protects the beauty of nature.',
      p1: 'Founded in 2019, Shanen Tech is a high-tech company focused on IoT systems. Guided by “Connecting Everything, Sensing with Wisdom,” we deliver full-stack monitoring solutions for reservoir safety, forest protection, land resources, and the environment through advanced sensors, data algorithms, and intelligent platforms.',
      p2: 'After five years of R&D and industry depth, Shanen has become a leading IoT monitoring provider in China, covering 50+ cities and serving water conservancy, forestry, natural resources, and environmental agencies as well as enterprises.',
      values: [
        { label: 'Mission', text: 'Connect Everything · Sense with Wisdom' },
        { label: 'Vision', text: 'A world-leading IoT solutions partner' },
        { label: 'Values', text: 'Precision · Innovation · Responsibility · Win-Win' },
      ],
      milestones: [
        { year: '2019', event: 'Company founded; focused on IoT R&D' },
        { year: '2020', event: 'First reservoir safety monitoring system went live' },
        { year: '2021', event: 'Expanded into forest and land monitoring' },
        { year: '2022', event: 'IoT platform surpassed 5,000 connected devices' },
        { year: '2023', event: 'Environment platform covered 50+ cities nationwide' },
        { year: '2024', event: 'Next-gen AIoT platform launched; 10,000+ devices' },
      ],
    },
    contact: {
      eyebrow: 'Contact Us',
      title: 'Contact Us',
      subtitle: 'Partner with us to build a smarter connected future.',
      addressLabel: 'Address',
      address: '4F Tianxiang Building, Chegongmiao, Futian, Shenzhen',
      phoneLabel: 'Phone',
      phoneBiz: 'Sales: 13265424932',
      phoneTech: 'Tech: 0755-83209287',
      emailLabel: 'Email',
      formTitle: 'Online Inquiry',
      successTitle: 'Submitted',
      successDesc: 'We will contact you within 1 business day.',
      errorTitle: 'Submission failed',
      errorDesc: 'Please try again later or call us.',
      name: 'Name',
      namePlaceholder: 'Your name',
      phone: 'Phone',
      phonePlaceholder: 'Your phone number',
      company: 'Company',
      companyPlaceholder: 'Company name',
      domain: 'Domain',
      domainPlaceholder: 'Select a domain',
      domainOptions: [
        { value: 'reservoir', label: 'Reservoir Monitoring' },
        { value: 'forest', label: 'Forest Monitoring' },
        { value: 'land', label: 'Land Monitoring' },
        { value: 'environment', label: 'Environment Monitoring' },
        { value: 'other', label: 'Other' },
      ],
      message: 'Message',
      messagePlaceholder: 'Briefly describe your needs',
      submit: 'Submit',
      submitting: 'Submitting...',
    },
    footer: {
      tagline1: 'Connecting Everything, Sensing with Wisdom.',
      tagline2: 'Focused on IoT system R&D and innovative applications.',
      solutions: 'Solutions',
      solutionItems: [
        'Reservoir Safety Monitoring',
        'Forest Resource Monitoring',
        'Land Resource Monitoring',
        'Ecological Environment Monitoring',
      ],
      company: 'Company',
      companyItems: ['About', 'Milestones', 'Technology', 'Careers'],
      contact: 'Contact',
      phoneBiz: 'Sales: 13265424932',
      phoneTech: 'Tech: 0755-83209287',
      email: 'Email: shanenservice@163.com',
      address: 'Address: 4F Tianxiang Building, Chegongmiao, Futian, Shenzhen',
      copyright: '© 2024 Shanen Tech. All rights reserved.',
      privacy: 'Privacy',
      terms: 'Terms',
      sitemap: 'Sitemap',
    },
  },
} as const;

export type Dictionary = (typeof translations)[Locale];

export const LOCALE_STORAGE_KEY = 'shanen-locale';
