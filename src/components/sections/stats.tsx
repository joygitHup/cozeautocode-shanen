'use client';

import { useEffect, useRef, useState } from 'react';
import { Cpu, Wifi, Shield, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

const advantageIcons = [Cpu, Wifi, Shield, BarChart3] as const;

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

function StatItem({
  value,
  suffix,
  label,
  prefix,
  inView,
}: {
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
  const { t } = useLanguage();
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
    <section
      id="stats"
      className="relative py-24 lg:py-32"
      ref={sectionRef}
      aria-labelledby="stats-heading"
    >
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e17] via-[#0d1420] to-[#0a0e17]" />
      <div className="absolute inset-0 grid-bg opacity-50" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-cyan-500/40" />
            <span className="text-xs font-mono text-cyan-400/60 tracking-widest uppercase">
              {t.stats.eyebrow}
            </span>
            <div className="w-8 h-px bg-cyan-500/40" />
          </div>
          <h2
            id="stats-heading"
            className="text-3xl lg:text-4xl font-bold text-slate-100 tracking-wide"
          >
            {t.stats.title}
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            {t.stats.subtitle}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#1e293b] border border-[#1e293b] rounded-sm mb-20">
          {t.stats.items.map((stat) => (
            <div key={stat.label} className="bg-[#0d1420]">
              <StatItem {...stat} inView={inView} />
            </div>
          ))}
        </div>

        {/* Advantages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.stats.advantages.map((adv, i) => {
            const Icon = advantageIcons[i];
            return (
              <div
                key={adv.title}
                className="group p-6 border border-[#1e293b] rounded-sm bg-[#111827]/30 hover:bg-[#111827]/60 transition-all duration-300 hover:border-cyan-500/20"
              >
                <div className="mb-4">
                  <Icon
                    className="w-8 h-8 text-cyan-400/70 group-hover:text-cyan-400 transition-colors"
                    strokeWidth={1.5}
                  />
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
