'use client';

import { Droplets, TreePine, Landmark, Leaf } from 'lucide-react';

const domains = [
  {
    icon: Droplets,
    title: '水库监测',
    subtitle: 'Reservoir Monitoring',
    description: '实时监测水库水位、流量、坝体变形等关键指标，构建覆盖全域的水利感知网络，为防汛预警与水资源调度提供数据支撑。',
    features: ['水位实时监测', '坝体安全预警', '流量数据分析', '防汛指挥调度'],
    color: 'cyan',
  },
  {
    icon: TreePine,
    title: '森林监测',
    subtitle: 'Forest Monitoring',
    description: '通过多维传感网络监测森林火险、病虫害、生态变化，实现林区全天候智能监控，守护绿色生态安全屏障。',
    features: ['火险早期预警', '病虫害识别', '生物多样性监测', '碳汇数据采集'],
    color: 'emerald',
  },
  {
    icon: Landmark,
    title: '国土监测',
    subtitle: 'Land Monitoring',
    description: '运用遥感与地面传感融合技术，对土地利用、地质灾害、矿产资源进行精准监测与智能分析。',
    features: ['土地利用分析', '地质灾害预警', '矿山安全监测', '测绘数据管理'],
    color: 'amber',
  },
  {
    icon: Leaf,
    title: '环境监测',
    subtitle: 'Environment Monitoring',
    description: '构建大气、水质、土壤多维度环境监测体系，实时采集分析环境数据，助力生态文明与可持续发展。',
    features: ['空气质量监测', '水质分析预警', '土壤污染检测', '噪声振动监测'],
    color: 'violet',
  },
];

const colorMap: Record<string, { border: string; text: string; bg: string; icon: string }> = {
  cyan: {
    border: 'hover:border-cyan-500/40',
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    icon: 'text-cyan-400',
  },
  emerald: {
    border: 'hover:border-emerald-500/40',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    icon: 'text-emerald-400',
  },
  amber: {
    border: 'hover:border-amber-500/40',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    icon: 'text-amber-400',
  },
  violet: {
    border: 'hover:border-violet-500/40',
    text: 'text-violet-400',
    bg: 'bg-violet-500/10',
    icon: 'text-violet-400',
  },
};

export default function DomainsSection() {
  return (
    <section id="domains" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-cyan-500/40" />
            <span className="text-xs font-mono text-cyan-400/60 tracking-widest uppercase">
              Business Domains
            </span>
            <div className="w-8 h-px bg-cyan-500/40" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-100 tracking-wide">
            四大核心领域
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            深耕物联网技术研发，为自然资源与生态环境提供全方位智慧监测解决方案
          </p>
        </div>

        {/* Domain Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {domains.map((domain, index) => {
            const colors = colorMap[domain.color];
            const Icon = domain.icon;
            return (
              <div
                key={index}
                className={`group relative p-6 lg:p-8 border border-[#1e293b] rounded-sm bg-[#111827]/50 backdrop-blur-sm transition-all duration-300 ${colors.border}`}
              >
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#1e293b] group-hover:border-cyan-500/30 transition-colors" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#1e293b] group-hover:border-cyan-500/30 transition-colors" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#1e293b] group-hover:border-cyan-500/30 transition-colors" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#1e293b] group-hover:border-cyan-500/30 transition-colors" />

                {/* Icon & Title */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-sm ${colors.bg}`}>
                    <Icon className={`w-6 h-6 ${colors.icon}`} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-100 tracking-wide">
                      {domain.title}
                    </h3>
                    <span className="text-xs font-mono text-slate-500 tracking-wider">
                      {domain.subtitle}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  {domain.description}
                </p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2">
                  {domain.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-1 h-1 rounded-full ${colors.bg.replace('/10', '/60')}`} />
                      <span className="text-xs text-slate-500">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
