import Navbar from '@/components/navbar';
import HeroSection from '@/components/sections/hero';
import DomainsSection from '@/components/sections/domains';
import StatsSection from '@/components/sections/stats';
import AboutSection from '@/components/sections/about';
import ContactSection from '@/components/sections/contact';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#0a0e17]">
      <Navbar />
      <HeroSection />
      <DomainsSection />
      <StatsSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
