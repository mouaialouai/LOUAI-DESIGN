import { useState } from 'react';
import { motion } from 'motion/react';
import { LanguageProvider, useLanguage } from './components/LanguageContext';
import CustomCursor from './components/CustomCursor';
import LanguageSwitcher from './components/LanguageSwitcher';
import InteractiveHero from './components/InteractiveHero';
import PortfolioShowcase from './components/PortfolioShowcase';
import ProcessApproach from './components/ProcessApproach';
import ClientTestimonials from './components/ClientTestimonials';
import ContactForm from './components/ContactForm';
import { Menu, X, ArrowUpRight } from 'lucide-react';

function Layout() {
  const { language, dir, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div 
      className="min-h-screen bg-brand-dark overflow-x-hidden relative"
      style={{ direction: dir }}
      id="app-root-layout"
    >
      {/* Visual noise overlay for supreme luxury textures */}
      <div className="noise-overlay absolute inset-0 pointer-events-none z-10 font-sans" />
      
      {/* Luxury Custom cursor element */}
      <CustomCursor />

      {/* Premium Glassmorphic Header */}
      <header className="fixed top-0 inset-x-0 w-full h-20 bg-[#0a0a0a]/75 backdrop-blur-md border-b border-white/[0.06] z-40 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto h-full px-6 md:px-8 flex items-center justify-between">
          
          {/* Refined Brand Signature */}
          <a 
            href="#hero-section" 
            className="flex items-center gap-3 group animate-fade-in"
            data-cursor-expand="true"
            data-cursor-text={language === 'en' ? 'TOP' : 'أعلى'}
            id="header-brand-logo"
          >
            {/* Elegant luxury gold gradient emblem */}
            <div className="w-8 h-8 rounded-none border border-[#9c8360]/35 bg-gradient-to-br from-[#9c8360]/20 via-[#1a1a1a]/40 to-[#9c8360]/30 shadow-[0_0_10px_rgba(156,131,96,0.08)] backdrop-blur-md flex items-center justify-center font-sans text-xs font-extrabold text-brand-beige group-hover:border-[#9c8360] group-hover:from-[#9c8360] group-hover:to-[#9c8360]/80 group-hover:text-[#0a0a0a] group-hover:shadow-[0_0_15px_rgba(156,131,96,0.25)] transition-all duration-500 ease-out">
              L
            </div>
            <span className={`text-xs font-black tracking-widest text-[#f5f2eb] group-hover:text-brand-accent transition-all duration-300 ${
              language === 'ar' ? 'font-arabic tracking-normal text-sm' : 'font-mono tracking-[0.2em] text-[11px]'
            }`}>
              {t.magneticCTALogo}
            </span>
          </a>

          {/* Desktop Nav Actions (All 5 shortcuts) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-8">
            <a 
              href="#portfolio-section" 
              className={`text-[#f5f2eb]/60 hover:text-[#e2b05c] transition-all duration-300 relative py-2 px-1 group ${
                language === 'ar' ? 'font-arabic text-sm font-light' : 'font-mono text-[10px] font-light tracking-[0.22em] uppercase'
              }`} 
              data-cursor-expand="true"
            >
              {t.navProjects}
              <span className="absolute bottom-0 left-1/2 w-0 h-[1px] bg-[#9c8360] transition-all duration-300 group-hover:w-full group-hover:left-0" />
            </a>
            <a 
              href="#process-section" 
              className={`text-[#f5f2eb]/60 hover:text-[#e2b05c] transition-all duration-300 relative py-2 px-1 group ${
                language === 'ar' ? 'font-arabic text-sm font-light' : 'font-mono text-[10px] font-light tracking-[0.22em] uppercase'
              }`} 
              data-cursor-expand="true"
            >
              {t.navProcess}
              <span className="absolute bottom-0 left-1/2 w-0 h-[1px] bg-[#9c8360] transition-all duration-300 group-hover:w-full group-hover:left-0" />
            </a>
            <a 
              href="#testimonials-section" 
              className={`text-[#f5f2eb]/60 hover:text-[#e2b05c] transition-all duration-300 relative py-2 px-1 group ${
                language === 'ar' ? 'font-arabic text-sm font-light' : 'font-mono text-[10px] font-light tracking-[0.22em] uppercase'
              }`} 
              data-cursor-expand="true"
            >
              {t.navTrust}
              <span className="absolute bottom-0 left-1/2 w-0 h-[1px] bg-[#9c8360] transition-all duration-300 group-hover:w-full group-hover:left-0" />
            </a>
            <a 
              href="#platforms-section" 
              className={`text-[#f5f2eb]/60 hover:text-[#e2b05c] transition-all duration-300 relative py-2 px-1 group ${
                language === 'ar' ? 'font-arabic text-sm font-light' : 'font-mono text-[10px] font-light tracking-[0.22em] uppercase'
              }`} 
              data-cursor-expand="true"
            >
              {t.navPlatforms}
              <span className="absolute bottom-0 left-1/2 w-0 h-[1px] bg-[#9c8360] transition-all duration-300 group-hover:w-full group-hover:left-0" />
            </a>
            <a 
              href="#contact-section" 
              className={`text-[#f5f2eb]/60 hover:text-[#e2b05c] transition-all duration-300 relative py-2 px-1 group ${
                language === 'ar' ? 'font-arabic text-sm font-light' : 'font-mono text-[10px] font-light tracking-[0.22em] uppercase'
              }`} 
              data-cursor-expand="true"
            >
              {t.navContact}
              <span className="absolute bottom-0 left-1/2 w-0 h-[1px] bg-[#9c8360] transition-all duration-300 group-hover:w-full group-hover:left-0" />
            </a>
          </nav>

          {/* Language Switcher and CTA bar */}
          <div className="hidden lg:flex items-center gap-12 font-sans">
            <LanguageSwitcher />
            
            <a 
              href="#contact-section"
              className="inline-flex items-center gap-2.5 px-6 py-2.5 bg-transparent border border-[#9c8360] text-[#9c8360] text-[10px] font-mono tracking-widest font-extrabold uppercase rounded-full hover:bg-[#9c8360] hover:text-[#0a0a0a] hover:border-[#9c8360] transition-all duration-300 ease-out"
              data-cursor-expand="true"
              data-cursor-text={language === 'en' ? 'HIRE' : 'توظيف'}
              id="header-nav-cta"
            >
              <span className={language === 'ar' ? 'font-arabic tracking-normal text-xs font-semibold' : ''}>
                {language === 'en' ? 'ENGAGE SYSTEM' : 'ابدأ مشروعك'}
              </span>
              <ArrowUpRight size={12} className="stroke-[3px]" />
            </a>
          </div>

          {/* Mobile switcher actions */}
          <div className="flex lg:hidden items-center gap-4">
            <LanguageSwitcher />
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-brand-beige hover:text-brand-accent p-2 animate-fade-in"
              id="header-mobile-toggle"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            className="absolute top-20 left-0 right-0 p-6 flex flex-col items-center gap-5 text-center z-30 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
          >
            <a href="#portfolio-section" onClick={() => setMobileMenuOpen(false)} className={`text-sm tracking-wide text-brand-beige/80 hover:text-[#e2b05c] transition-colors ${language === 'ar' ? 'font-arabic text-base' : 'font-mono uppercase text-[11px] tracking-[0.2em]'}`}>{t.navProjects}</a>
            <a href="#process-section" onClick={() => setMobileMenuOpen(false)} className={`text-sm tracking-wide text-[#f5f2eb]/80 hover:text-[#e2b05c] transition-colors ${language === 'ar' ? 'font-arabic text-base' : 'font-mono uppercase text-[11px] tracking-[0.2em]'}`}>{t.navProcess}</a>
            <a href="#testimonials-section" onClick={() => setMobileMenuOpen(false)} className={`text-sm tracking-wide text-[#f5f2eb]/80 hover:text-[#e2b05c] transition-colors ${language === 'ar' ? 'font-arabic text-base' : 'font-mono uppercase text-[11px] tracking-[0.2em]'}`}>{t.navTrust}</a>
            <a href="#platforms-section" onClick={() => setMobileMenuOpen(false)} className={`text-sm tracking-wide text-[#f5f2eb]/80 hover:text-[#e2b05c] transition-colors ${language === 'ar' ? 'font-arabic text-base' : 'font-mono uppercase text-[11px] tracking-[0.2em]'}`}>{t.navPlatforms}</a>
            <a href="#contact-section" onClick={() => setMobileMenuOpen(false)} className={`text-sm text-[#9c8360] font-bold hover:text-white transition-colors ${language === 'ar' ? 'font-arabic text-base' : 'font-mono uppercase text-[11px] tracking-[0.15em]'}`}>{t.navContact}</a>
          </motion.div>
        )}
      </header>

      {/* Main Core Segment Arrays */}
      <main className="pt-20">
        <InteractiveHero />
        <PortfolioShowcase />
        <ProcessApproach />
        <ClientTestimonials />
        <ContactForm />
      </main>

      {/* Footer Details */}
      <footer className="bg-brand-dark py-14 px-6 border-t border-brand-accent/10 relative z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Cinematic Copyright Block */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 font-mono text-[9px] text-brand-muted/70 uppercase select-none tracking-[0.45em] leading-relaxed">
            <span>© {new Date().getFullYear()} LOUAI MOUAIA</span>
            <span className="w-1.5 h-[1px] bg-white/10 hidden sm:inline" />
            <span>ALL DESIGN PROTOCOLS SECURED</span>
          </div>

          {/* Luxury Floating Social Anchor */}
          <div className="flex items-center gap-4">
            <a 
              href="https://www.behance.net/louaimouaia" 
              target="_blank" 
              rel="noreferrer"
              className="text-brand-accent hover:text-brand-beige text-[10px] font-mono uppercase tracking-[0.2em] flex items-center gap-2 px-4 py-2 border border-brand-accent/20 hover:border-brand-accent/50 bg-[#0c0c0c]/40 hover:-translate-y-0.5 transition-all duration-300 ease-out group/behance"
              data-cursor-expand="true"
              data-cursor-text="LINK"
              id="footer-behance-link"
            >
              <span className={language === 'ar' ? 'font-arabic text-xs tracking-normal font-semibold' : ''}>
                {language === 'en' ? 'BEHANCE DIRECT' : 'رابط البيهانس المباشر'}
              </span>
              <ArrowUpRight size={13} className="transition-transform duration-300 group-hover/behance:translate-x-0.5 group-hover/behance:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Layout />
    </LanguageProvider>
  );
}
