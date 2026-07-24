'use client';

import { Target, Eye, Award } from 'lucide-react';

const milestones = [
  { year: '2019', event: '公司成立，聚焦物联网技术研发' },
  { year: '2020', event: '首个水库安全监测系统上线运行' },
  { year: '2021', event: '业务拓展至森林、国土监测领域' },
  { year: '2022', event: '获评国家高新技术企业' },
  { year: '2023', event: '环境监测平台覆盖全国 50+ 城市' },
  { year: '2024', event: '新一代 AIoT 平台发布，万级设备接入' },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-cyan-500/40" />
            <span className="text-xs font-mono text-cyan-400/60 tracking-widest uppercase">
              About Us
            </span>
            <div className="w-8 h-px bg-cyan-500/40" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-100 tracking-wide">
            关于杉恩
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            以科技之力，守护自然之美
          </p>
        </div>

        {/* About Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
          {/* Left - Description */}
          <div>
            <p className="text-slate-300 leading-relaxed text-base lg:text-lg">
              杉恩科技成立于 2019 年，是一家专注于物联网系统研发的高新技术企业。
              公司以"万物互联，智慧感知"为使命，致力于通过先进的传感器技术、
              数据处理算法和智能分析平台，为水库安全、森林保护、国土资源、
              生态环境等关键领域提供全方位的监测解决方案。
            </p>
            <p className="mt-4 text-slate-400 leading-relaxed">
              经过五年的技术积累与行业深耕，杉恩科技已发展成为国内物联网监测
              领域的领先企业，业务覆盖全国 50 余个城市，服务客户涵盖水利、林业、
              自然资源、生态环境等政府部门及企事业单位。
            </p>

            {/* Values */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Target, label: '使命', text: '万物互联 智慧感知' },
                { icon: Eye, label: '愿景', text: '成为全球领先的 IoT 方案商' },
                { icon: Award, label: '价值观', text: '精准 创新 担当 共赢' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="p-4 border border-[#1e293b] rounded-sm bg-[#111827]/30">
                    <Icon className="w-5 h-5 text-cyan-400/70 mb-2" strokeWidth={1.5} />
                    <div className="text-xs text-slate-500 mb-1">{item.label}</div>
                    <div className="text-sm text-slate-200 font-medium">{item.text}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right - Timeline */}
          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-cyan-500/40 via-[#1e293b] to-[#1e293b]" />
            <div className="space-y-6">
              {milestones.map((milestone, i) => (
                <div key={i} className="relative pl-8">
                  <div className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-[#1e293b] bg-[#0a0e17] flex items-center justify-center">
                    <div className="w-[5px] h-[5px] rounded-full bg-cyan-400" />
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-sm font-mono text-cyan-400/80 font-medium">
                      {milestone.year}
                    </span>
                    <span className="text-sm text-slate-400">{milestone.event}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
