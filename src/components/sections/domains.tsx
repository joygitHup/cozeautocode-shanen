'use client';

import { Droplets, TreePine, Landmark, Leaf } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

const domainMeta = [
  { icon: Droplets, color: 'cyan' },
  { icon: TreePine, color: 'emerald' },
  { icon: Landmark, color: 'amber' },
  { icon: Leaf, color: 'violet' },
] as const;

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
  const { t } = useLanguage();

  return (
    <section
      id="domains"
      className="relative py-24 lg:py-32"
      aria-labelledby="domains-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-cyan-500/40" />
            <span className="text-[13px] font-mono text-cyan-400/80 tracking-widest uppercase">
              {t.domains.eyebrow}
            </span>
            <div className="w-8 h-px bg-cyan-500/40" />
          </div>
          <h2
            id="domains-heading"
            className="text-4xl lg:text-5xl font-bold text-slate-100 tracking-wide text-balance"
          >
            {t.domains.title}
          </h2>
          <p className="mt-4 text-base lg:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed text-pretty">
            {t.domains.subtitle}
          </p>
        </div>

        {/* Domain Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {t.domains.items.map((domain, index) => {
            const meta = domainMeta[index];
            const colors = colorMap[meta.color];
            const Icon = meta.icon;
            return (
              <div
                key={domain.title}
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
                    <span className="text-[13px] font-mono text-slate-400 tracking-wider">
                      {domain.subtitle}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-400 leading-7 mb-6">
                  {domain.description}
                </p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2">
                  {domain.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <div className={`w-1 h-1 rounded-full ${colors.bg.replace('/10', '/60')}`} />
                      <span className="text-[13px] text-slate-400">{feature}</span>
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
