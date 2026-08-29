'use client';

import { Target, Eye, Award } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

const valueIcons = [Target, Eye, Award] as const;

export default function AboutSection() {
  const { t } = useLanguage();

  return (
    <section
      id="about"
      className="relative py-24 lg:py-32"
      aria-labelledby="about-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-cyan-500/40" />
            <span className="text-xs font-mono text-cyan-400/60 tracking-widest uppercase">
              {t.about.eyebrow}
            </span>
            <div className="w-8 h-px bg-cyan-500/40" />
          </div>
          <h2
            id="about-heading"
            className="text-3xl lg:text-4xl font-bold text-slate-100 tracking-wide"
          >
            {t.about.title}
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            {t.about.subtitle}
          </p>
        </div>

        {/* About Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
          {/* Left - Description */}
          <div>
            <p className="text-slate-300 leading-relaxed text-base lg:text-lg">
              {t.about.p1}
            </p>
            <p className="mt-4 text-slate-400 leading-relaxed">
              {t.about.p2}
            </p>

            {/* Values */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {t.about.values.map((item, i) => {
                const Icon = valueIcons[i];
                return (
                  <div
                    key={item.label}
                    className="p-4 border border-[#1e293b] rounded-sm bg-[#111827]/30"
                  >
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
              {t.about.milestones.map((milestone) => (
                <div key={milestone.year} className="relative pl-8">
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
