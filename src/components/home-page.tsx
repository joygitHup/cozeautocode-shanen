'use client';

import { LanguageProvider } from '@/lib/i18n/context';
import Navbar from '@/components/navbar';
import HeroSection from '@/components/sections/hero';
import DomainsSection from '@/components/sections/domains';
import StatsSection from '@/components/sections/stats';
import AboutSection from '@/components/sections/about';
import ContactSection from '@/components/sections/contact';
import Footer from '@/components/footer';

export default function HomePage() {
  return (
    <LanguageProvider>
      <main className="relative min-h-screen bg-[#0a0e17]">
        <a
          href="#domains"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-[#0a0e17] focus:rounded-sm"
        >
          跳到主要内容
        </a>
        <Navbar />
        <HeroSection />
        <DomainsSection />
        <StatsSection />
        <AboutSection />
        <ContactSection />
        <Footer />
      </main>
    </LanguageProvider>
  );
}
