'use client';

import { useEffect, useRef, useState } from 'react';
import { Cpu, Wifi, Shield, BarChart3 } from 'lucide-react';

const stats = [
  { value: 50, suffix: '+', label: '研发团队', prefix: '' },
  { value: 100, suffix: '+', label: '项目案例', prefix: '' },
  { value: 50, suffix: '+', label: '城市覆盖', prefix: '' },
  { value: 10000, suffix: '+', label: '在线设备', prefix: '' },
];

const advantages = [
  {
    icon: Cpu,
    title: '自研核心算法',
    description: '自主研发的数据处理与智能分析算法，支持边缘计算与云端协同，实现毫秒级响应。',
  },
  {
    icon: Wifi,
    title: '全域感知网络',
    description: '支持 LoRa、NB-IoT、4G/5G 等多协议接入，构建广覆盖、低功耗的传感网络。',
  },
  {
    icon: Shield,
    title: '高可靠架构',
    description: '分布式微服务架构，多活容灾设计，系统可用率达 99.9%，数据安全有保障。',
  },
  {
    icon: BarChart3,
    title: '智能决策平台',
    description: '融合大数据与 AI 分析能力，提供可视化决策支持，从数据到洞察一步到位。',
  },
];

function useCountUp(target: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number;
    let animationId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [target, duration, start]);

  return count;
}

function StatItem({ value, suffix, label, prefix, inView }: {
  value: number;
  suffix: string;
  label: string;
  prefix: string;
  inView: boolean;
}) {
  const count = useCountUp(value, 2000, inView);

  return (
    <div className="text-center p-6">
      <div className="flex items-baseline justify-center">
        <span className="text-xs text-slate-500 font-mono mr-0.5">{prefix}</span>
        <span className="text-4xl lg:text-5xl font-mono font-bold text-cyan-400">
          {count.toLocaleString()}
        </span>
        <span className="text-lg text-cyan-400/60 font-mono ml-0.5">{suffix}</span>
      </div>
      <div className="text-sm text-slate-400 mt-2 tracking-wider">{label}</div>
    </div>
  );
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats" className="relative py-24 lg:py-32" ref={sectionRef}>
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e17] via-[#0d1420] to-[#0a0e17]" />
      <div className="absolute inset-0 grid-bg opacity-50" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-cyan-500/40" />
            <span className="text-xs font-mono text-cyan-400/60 tracking-widest uppercase">
              Technical Strength
            </span>
            <div className="w-8 h-px bg-cyan-500/40" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-100 tracking-wide">
            技术实力
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            以技术创新驱动行业发展，用数据连接万物
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#1e293b] border border-[#1e293b] rounded-sm mb-20">
          {stats.map((stat, i) => (
            <div key={i} className="bg-[#0d1420]">
              <StatItem {...stat} inView={inView} />
            </div>
          ))}
        </div>

        {/* Advantages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((adv, i) => {
            const Icon = adv.icon;
            return (
              <div
                key={i}
                className="group p-6 border border-[#1e293b] rounded-sm bg-[#111827]/30 hover:bg-[#111827]/60 transition-all duration-300 hover:border-cyan-500/20"
              >
                <div className="mb-4">
                  <Icon className="w-8 h-8 text-cyan-400/70 group-hover:text-cyan-400 transition-colors" strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-bold text-slate-100 mb-2 tracking-wide">
                  {adv.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {adv.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
