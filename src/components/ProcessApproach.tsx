import { useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from './LanguageContext';
import { PROCESS_PHASES } from '../data';
import { Network, Terminal, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

export default function ProcessApproach() {
  const { t, language } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section 
      className="py-24 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/5 relative z-20"
      id="process-section"
    >
      <div className="text-center max-w-3xl mx-auto mb-20">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Activity size={12} className="text-brand-accent animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-brand-accent font-semibold">
            ENGINEERING PROTOCOLS // المنهجية
          </span>
        </div>
        
        <h2 className={`text-3xl md:text-5xl font-extrabold text-white uppercase mb-6 ${
          language === 'ar' ? 'font-arabic leading-snug' : 'font-display'
        }`}>
          {t.processTitle}
        </h2>
        
        <p className={`text-sm sm:text-base text-brand-beige/70 leading-relaxed ${
          language === 'ar' ? 'font-arabic' : ''
        }`}>
          {t.processSubtitle}
        </p>
      </div>

      {/* Advanced Interactive Process Tab Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch" id="process-blueprint-container">
        
        {/* Step Selectors Column (Left/Right depending on lang) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            {PROCESS_PHASES.map((phase, idx) => (
              <button
                key={phase.number}
                onClick={() => setActiveStep(idx)}
                className={`w-full text-left rtl:text-right p-6 rounded-none border transition-all duration-300 flex items-center justify-between gap-4 select-none cursor-pointer ${
                  activeStep === idx 
                    ? 'bg-brand-surface border-brand-accent text-white shadow-lg' 
                    : 'bg-brand-surface/30 border-white/5 text-brand-beige/50 hover:bg-brand-surface/50 hover:text-brand-beige hover:border-white/10'
                }`}
                data-cursor-expand="true"
                data-cursor-text={`0${idx + 1}`}
                id={`process-btn-${idx}`}
              >
                <div className="flex items-center gap-4">
                  <span className={`text-sm font-mono ${
                    activeStep === idx ? 'text-brand-accent font-bold' : 'text-brand-muted'
                  }`}>
                    {phase.number}
                  </span>
                  
                  <span className={`text-sm sm:text-base font-bold ${
                    language === 'ar' ? 'font-arabic' : 'font-sans'
                  }`}>
                    {language === 'en' ? phase.titleEn : phase.titleAr}
                  </span>
                </div>

                <div className={`p-1.5 rounded-full border transition-transform duration-300 ${
                  activeStep === idx 
                    ? 'border-brand-accent text-brand-accent rotate-90 rtl:-rotate-90' 
                    : 'border-white/10 text-brand-muted/40'
                }`}>
                  <ChevronRight size={14} className="rtl:rotate-180" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Step Display Panel Column */}
        <div className="lg:col-span-7 bg-brand-surface border border-white/5 p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          
          {/* Subtle watermark */}
          <div className="absolute top-0 right-0 p-8 text-white/2 select-none pointer-events-none font-mono text-8xl font-black">
            {PROCESS_PHASES[activeStep].number}
          </div>

          <div className="space-y-6 relative z-10">
            {/* Display Badge tracking */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-brand-accent uppercase tracking-widest bg-brand-accent/10 px-2.5 py-1">
                PROTOCOL PHASE {PROCESS_PHASES[activeStep].number}
              </span>
              <span className="text-[10px] font-mono text-brand-muted">
                DURABLE SYSTEM
              </span>
            </div>

            <h3 className={`text-2xl sm:text-3xl font-extrabold text-white uppercase leading-snug ${
              language === 'ar' ? 'font-arabic' : 'font-display'
            }`}>
              {language === 'en' ? PROCESS_PHASES[activeStep].titleEn : PROCESS_PHASES[activeStep].titleAr}
            </h3>

            <p className={`text-sm sm:text-base text-brand-beige/70 leading-relaxed ${
              language === 'ar' ? 'font-arabic' : ''
            }`}>
              {language === 'en' ? PROCESS_PHASES[activeStep].descEn : PROCESS_PHASES[activeStep].descAr}
            </p>

            <div className="pt-6 border-t border-white/5 space-y-3">
              <h4 className={`text-xs font-mono uppercase tracking-widest text-brand-accent font-bold ${
                language === 'ar' ? 'font-arabic' : ''
              }`}>
                {language === 'en' ? 'Phase Details:' : 'تفاصيل المرحلة:'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {(language === 'en' ? PROCESS_PHASES[activeStep].detailsEn : PROCESS_PHASES[activeStep].detailsAr).map((detail, dIdx) => (
                  <div 
                    key={dIdx}
                    className="flex items-center gap-3 bg-brand-dark/40 border border-white/2 p-3.5"
                  >
                    <CheckCircle2 size={13} className="text-brand-accent shrink-0" />
                    <span className={`text-xs text-brand-beige/60 leading-tight ${
                      language === 'ar' ? 'font-arabic' : ''
                    }`}>
                      {detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-brand-muted tracking-widest relative z-10">
            <span>VERSION // 2026.04</span>
            <span>SECURE // LOUAI MOUAIA DIGITAL PROTOCOL</span>
          </div>

        </div>

      </div>
    </section>
  );
}
