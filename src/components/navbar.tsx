'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

export default function Navbar() {
  const { t, toggleLocale } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: t.nav.home, href: '#hero' },
    { label: t.nav.domains, href: '#domains' },
    { label: t.nav.stats, href: '#stats' },
    { label: t.nav.about, href: '#about' },
    { label: t.nav.contact, href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      aria-label={t.nav.home}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0e17]/90 backdrop-blur-xl border-b border-[#1e293b]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-3">
            <div className="w-8 h-8 relative">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-sm" />
              <div className="absolute inset-[3px] border border-cyan-500/60 rounded-sm" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full" />
            </div>
            <span className="text-lg font-bold tracking-wider text-slate-100">
              {t.brand}
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-200 tracking-wide"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={toggleLocale}
              aria-label={t.langSwitchAria}
              className="ml-2 px-2.5 py-1 text-xs font-mono tracking-wider text-cyan-400/80 border border-cyan-500/30 rounded-sm hover:bg-cyan-500/10 hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-200"
            >
              {t.langSwitch}
            </button>
          </div>

          {/* Mobile: lang + menu */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              type="button"
              onClick={toggleLocale}
              aria-label={t.langSwitchAria}
              className="px-2 py-1 text-xs font-mono tracking-wider text-cyan-400/80 border border-cyan-500/30 rounded-sm hover:bg-cyan-500/10 transition-all duration-200"
            >
              {t.langSwitch}
            </button>
            <button
              type="button"
              className="text-slate-400 hover:text-cyan-400 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0a0e17]/95 backdrop-blur-xl border-b border-[#1e293b]">
          <div className="px-6 py-4 space-y-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block text-sm text-slate-400 hover:text-cyan-400 transition-colors py-2"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
