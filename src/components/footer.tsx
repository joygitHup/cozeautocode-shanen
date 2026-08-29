'use client';

import { useLanguage } from '@/lib/i18n/context';

export default function Footer() {
  const { t } = useLanguage();

  const solutionLinks = [
    { label: t.footer.solutionItems[0], href: '#domains' },
    { label: t.footer.solutionItems[1], href: '#domains' },
    { label: t.footer.solutionItems[2], href: '#domains' },
    { label: t.footer.solutionItems[3], href: '#domains' },
  ];

  const companyLinks = [
    { label: t.footer.companyItems[0], href: '#about' },
    { label: t.footer.companyItems[1], href: '#about' },
    { label: t.footer.companyItems[2], href: '#stats' },
    { label: t.footer.companyItems[3], href: '#contact' },
  ];

  return (
    <footer className="relative border-t border-[#1e293b] bg-[#0a0e17]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 relative" aria-hidden="true">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-sm" />
                <div className="absolute inset-[3px] border border-cyan-500/60 rounded-sm" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full" />
              </div>
              <span className="text-base font-bold tracking-wider text-slate-200">
                {t.brand}
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              {t.footer.tagline1}
              <br />
              {t.footer.tagline2}
            </p>
          </div>

          {/* Solutions */}
          <nav aria-label={t.footer.solutions}>
            <h4 className="text-sm font-medium text-slate-300 mb-4 tracking-wider">
              {t.footer.solutions}
            </h4>
            <ul className="space-y-2.5">
              {solutionLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-slate-500 hover:text-cyan-400/70 transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label={t.footer.company}>
            <h4 className="text-sm font-medium text-slate-300 mb-4 tracking-wider">
              {t.footer.company}
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-slate-500 hover:text-cyan-400/70 transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-4 tracking-wider">
              {t.footer.contact}
            </h4>
            <ul className="space-y-2.5">
              <li className="text-sm text-slate-500">
                <a href="tel:13265424932" className="hover:text-cyan-400/70 transition-colors">
                  {t.footer.phoneBiz}
                </a>
              </li>
              <li className="text-sm text-slate-500">
                <a href="tel:075583209287" className="hover:text-cyan-400/70 transition-colors">
                  {t.footer.phoneTech}
                </a>
              </li>
              <li className="text-sm text-slate-500">
                <a
                  href="mailto:shanenservice@163.com"
                  className="hover:text-cyan-400/70 transition-colors"
                >
                  {t.footer.email}
                </a>
              </li>
              <li className="text-sm text-slate-500">{t.footer.address}</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-[#1e293b] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-600">{t.footer.copyright}</p>
          <div className="flex items-center gap-4">
            <a
              href="/sitemap.xml"
              className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
            >
              {t.footer.sitemap}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
