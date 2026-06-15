import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from './LanguageContext';
import { Mail, Landmark, Send, CheckCircle, ShieldAlert, ArrowUpRight, Award, ExternalLink } from 'lucide-react';

export default function ContactForm() {
  const { t, language } = useLanguage();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      setStatus('error');
      return;
    }
    
    setStatus('submitting');
    
    try {
      const textMessage = `🔥 *طلب مشروع جديد من الموقع الشخصي* 🔥

👤 *الاسم / الجهة:* ${formState.name}
✉️ *البريد الإلكتروني:* ${formState.email}
💼 *اسم المشروع أو الشركة:* ${formState.company || '—'}
📝 *تفاصيل ومتطلبات المشروع:*
${formState.message}`;

      const whatsappUrl = `https://wa.me/213656874473?text=${encodeURIComponent(textMessage)}`;
      window.open(whatsappUrl, '_blank');
      
      setStatus('success');
      setFormState({
        name: '',
        email: '',
        company: '',
        message: ''
      });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section 
      className="py-32 px-4 sm:px-8 max-w-7xl mx-auto border-t border-white/5 relative z-20"
      id="contact-section"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* 1. Header Section - Centered and Symmetric Layout */}
      <div className="mb-16 pb-12 border-b border-white/5 flex flex-col items-center text-center mx-auto max-w-3xl space-y-4">
        <div className="flex items-center gap-2 justify-center">
          <span className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-ping" />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-brand-accent font-semibold">
            {language === 'ar' ? 'صناعة المحتوى البصري' : 'VISUAL CREATIONS // COMMISSION PROTOCOLS'}
          </span>
        </div>
        
        <h2 className={`text-4xl md:text-5xl font-extrabold text-white tracking-tight uppercase leading-tight ${
          language === 'ar' ? 'font-arabic leading-snug' : 'font-display'
        }`}>
          {t.contactTitle}
        </h2>
        
        <p className={`text-sm text-brand-beige/60 leading-relaxed max-w-2xl ${
          language === 'ar' ? 'font-arabic' : ''
        }`}>
          {t.contactSubtitle}
        </p>
      </div>

      {/* 2. Main Area: Two-Column Form and Side Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
        
        {/* Side Panel Column - Spans 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          {/* Coordinates information */}
          <div className="p-8 bg-[#0c0c0c]/80 border border-white/5 relative overflow-hidden backdrop-blur-md">
            <h3 className={`text-base font-bold text-white mb-6 uppercase tracking-wide flex items-center gap-2 ${
              language === 'ar' ? 'font-arabic justify-start' : ''
            }`}>
              <span className="text-xs font-mono text-brand-accent">02 //</span>
              {language === 'en' ? 'Get in Touch Directly' : 'ابقَ على تواصل مباشر'}
            </h3>

            <div className={`space-y-6 ${language === 'ar' ? 'text-right' : ''}`}>
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-white/5 border border-white/10 text-brand-accent rounded mt-0.5 shrink-0">
                  <Mail size={16} />
                </div>
                <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                  <span className="text-[9px] font-mono text-brand-muted uppercase tracking-wider block">OFFICIAL EMAIL</span>
                  <a 
                    href="mailto:mouaialouai4@gmail.com"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open("mailto:mouaialouai4@gmail.com", "_blank");
                    }}
                    className="text-sm font-mono text-brand-beige hover:text-brand-accent transition-colors duration-300 font-medium block cursor-pointer"
                    data-cursor-expand="true"
                    data-cursor-text="MAIL"
                  >
                    mouaialouai4@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-white/5 border border-white/10 text-brand-accent rounded mt-0.5 shrink-0">
                  <Landmark size={16} />
                </div>
                <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                  <span className="text-[9px] font-mono text-brand-muted uppercase tracking-wider block">STUDIO LOCATION</span>
                  <span className={`text-sm text-brand-beige font-mono block ${language === 'ar' ? 'font-arabic font-medium' : ''}`}>
                    {language === 'en' ? 'Algeria // Global Coverage' : 'الجزائر // تغطية عالمية'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-white/5 border border-white/10 text-brand-accent rounded mt-0.5 shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current stroke-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.707 1.46h.005c6.56 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
                  </svg>
                </div>
                <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                  <span className="text-[9px] font-mono text-brand-muted uppercase tracking-wider block">WHATSAPP CONTACT</span>
                  <a 
                    href="https://wa.me/213656874473"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm text-brand-beige hover:text-brand-accent transition-colors duration-300 font-medium block ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}
                    data-cursor-expand="true"
                    data-cursor-text="WHATSAPP"
                  >
                    {language === 'en' ? 'Fast & Direct Chat' : 'تواصل سريع ومباشر'}
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Prompt/Quality seal */}
          <div className="p-8 border border-white/5 bg-gradient-to-br from-brand-accent/5 to-transparent text-center relative overflow-hidden hidden sm:block">
            <Award className="mx-auto text-brand-accent/60 mb-3" size={28} />
            <h4 className={`text-xs font-mono uppercase tracking-widest text-brand-beige mb-1 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {language === 'en' ? 'Creative Excellence & Distinction' : 'شرف التميز والجودة الإبداعية'}
            </h4>
            <p className={`text-[10px] text-brand-muted leading-relaxed max-w-xs mx-auto ${language === 'ar' ? 'font-arabic' : ''}`}>
              {language === 'en'
                ? 'Crafting exclusive visual solutions to establish prestigious brand identities for entrepreneurs and organizations.'
                : 'نبتكر حلولاً بصرية حصرية لترسيخ الهويات التجارية المرموقة لرواد الأعمال والمؤسسات.'}
            </p>
          </div>
        </div>

        {/* Form Column - Spans 7 cols */}
        <div className="lg:col-span-7 bg-[#0c0c0c]/80 backdrop-blur-md border border-white/5 p-8 sm:p-10 relative shadow-2xl">
          <div className="absolute top-0 left-0 w-2 h-[2px] bg-brand-accent" />
          <div className="absolute top-0 left-0 w-[2px] h-2 bg-brand-accent" />
          <div className="absolute bottom-0 right-0 w-2 h-[2px] bg-brand-accent" />
          <div className="absolute bottom-0 right-0 w-[2px] h-2 bg-brand-accent" />

          <h3 className={`text-lg font-bold text-white mb-8 border-b border-white/5 pb-4 uppercase tracking-wide flex items-center gap-2 ${
            language === 'ar' ? 'font-arabic justify-start' : ''
          }`}>
            <span className="text-xs font-mono text-brand-accent">01 //</span>
            {language === 'en' ? 'Kickstart Your Project' : 'ابدأ مشروعك من هنا'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name */}
              <div className="relative group">
                <label className={`text-[10px] font-mono uppercase tracking-wider text-brand-muted block mb-2 ${
                  language === 'ar' ? 'font-arabic text-right' : ''
                }`}>
                  {t.contactName} *
                </label>
                <input 
                  type="text" 
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                  className={`w-full bg-brand-dark/50 border border-white/5 px-4 py-3.5 text-xs text-white focus:outline-none focus:border-brand-accent focus:bg-brand-dark transition-all duration-300 ${
                    language === 'ar' ? 'font-arabic text-right placeholder:text-right' : 'text-left placeholder:text-left'
                  }`}
                  required
                  placeholder={language === 'en' ? 'e.g. John Doe' : 'مثال: محمد عبدالله'}
                />
              </div>

              {/* Email */}
              <div className="relative group">
                <label className={`text-[10px] font-mono uppercase tracking-wider text-brand-muted block mb-2 ${
                  language === 'ar' ? 'font-arabic text-right' : ''
                }`}>
                  {t.contactEmail} *
                </label>
                <input 
                  type="email" 
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  dir="ltr"
                  className="w-full bg-brand-dark/50 border border-white/5 px-4 py-3.5 text-xs text-white focus:outline-none focus:border-brand-accent focus:bg-brand-dark transition-all duration-300 text-left placeholder:text-left"
                  required
                  placeholder="name@institution.com"
                />
              </div>
            </div>

            {/* Corporate Entity */}
            <div className="relative group">
              <label className={`text-[10px] font-mono uppercase tracking-wider text-brand-muted block mb-2 ${
                language === 'ar' ? 'font-arabic text-right' : ''
              }`}>
                {t.contactCompany}
              </label>
              <input 
                type="text" 
                value={formState.company}
                onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
                className={`w-full bg-brand-dark/50 border border-white/5 px-4 py-3.5 text-xs text-white focus:outline-none focus:border-brand-accent focus:bg-brand-dark transition-all duration-300 ${
                  language === 'ar' ? 'font-arabic text-right placeholder:text-right' : 'text-left placeholder:text-left'
                }`}
                placeholder={language === 'en' ? 'e.g. Al-Qudra Capital' : 'مثال: شركة النخبة المحدودة'}
              />
            </div>

            {/* Objectives Brief */}
            <div className="relative group">
              <label className={`text-[10px] font-mono uppercase tracking-wider text-brand-muted block mb-2 ${
                language === 'ar' ? 'font-arabic text-right' : ''
              }`}>
                {t.contactMessage} *
              </label>
              <textarea 
                rows={5}
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
                className={`w-full bg-brand-dark/50 border border-white/5 px-4 py-3.5 text-xs text-white focus:outline-none focus:border-brand-accent focus:bg-brand-dark transition-all duration-300 resize-none ${
                  language === 'ar' ? 'font-arabic text-right placeholder:text-right' : 'text-left placeholder:text-left'
                }`}
                required
                placeholder={language === 'en' ? 'Outline scope of identity framework or poster campaign requirements' : 'يرجى إبراز المتطلبات الفنية للهوية البصرية أو الحملة الدعائية'}
              />
            </div>

            {/* Validation Alerts */}
            <AnimatePresence>
              {status === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-xs flex items-center gap-3"
                >
                  <CheckCircle size={14} className="shrink-0" />
                  <span className={language === 'ar' ? 'font-arabic' : ''}>{t.contactSuccess}</span>
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3"
                >
                  <ShieldAlert size={14} className="shrink-0" />
                  <span className={language === 'ar' ? 'font-arabic' : ''}>{t.contactFailure}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Trigger - Gold brand button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-4.5 bg-brand-accent text-brand-dark hover:bg-white text-xs sm:text-xs font-mono font-bold uppercase tracking-[0.25em] transition-all duration-300 border border-brand-accent hover:border-white disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer"
                data-cursor-expand="true"
                data-cursor-text={language === 'en' ? 'TRANSMIT' : 'إرسال'}
                id="contact-submit-btn"
              >
                <span className={language === 'ar' ? 'font-arabic tracking-normal' : ''}>
                  {status === 'submitting' ? (language === 'en' ? 'TRANSMITTING...' : 'جاري الإرسال...') : t.contactSubmit}
                </span>
                <Send size={13} className="animate-pulse" />
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* 3. Bottom Direct Platforms Grid (Khamsat & Behance) - Redesigned premium dual widget box */}
      <div id="platforms-section" className="border-t border-white/5 pt-12">
        <h3 className={`text-xs font-mono text-brand-accent uppercase tracking-[0.2em] mb-8 text-center flex items-center justify-center gap-3 ${
          language === 'ar' ? 'font-arabic' : ''
        }`}>
          <span className="w-10 h-[1px] bg-brand-accent/30" />
          <span>{language === 'en' ? 'WORK PLATFORMS & DIRECT COLLABORATION' : 'منصات العمل والشراكة المباشرة'}</span>
          <span className="w-10 h-[1px] bg-brand-accent/30" />
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card A: Khamsat Direct Hire */}
          <div className="p-8 bg-[#0c0c0c]/90 border border-brand-accent/15 hover:border-brand-accent/40 relative overflow-hidden group transition-all duration-300 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-3xl group-hover:bg-brand-accent/8 animate-pulse duration-[8s]" />
            <div className="absolute top-0 left-0 w-[1px] h-0 bg-brand-accent group-hover:h-full transition-all duration-500" />
            <div className="absolute top-0 left-0 w-0 h-[1px] bg-brand-accent group-hover:w-full transition-all duration-300" />
            
            <div>
              <div className={`flex items-center gap-3 mb-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono text-brand-accent uppercase tracking-widest font-bold">
                  {language === 'en' ? 'KHAMSAT PARTNERSHIP' : 'منصة خمسات للخدمات'}
                </span>
              </div>

              <h4 className={`text-base font-bold text-white mb-3 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>
                {language === 'en' ? 'Order Creative Solutions' : 'اطلب خدماتك الإبداعية الآن'}
              </h4>

              <p className={`text-xs text-brand-beige/70 leading-relaxed mb-6 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>
                {language === 'en'
                  ? 'Initiate direct design collaborations with complete security and escrow assurances on the prominent Khamsat service marketplace.'
                  : 'ابدأ العمل معي فوراً وبضمان كامل لحقوقك الاستثمارية. يمكنك طلب خدمات تصميم الهويات البصرية، الشعارات، وحملات السوشيال ميديا الإعلانية مباشرة عبر منصة خمسات الرائدة بموثوقية تامة.'}
              </p>
            </div>

            <div className={`pt-2 ${language === 'ar' ? 'text-right' : ''}`}>
              <a 
                href="https://khamsat.com/user/louayymouaia" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-brand-accent text-brand-dark hover:bg-white text-[10px] font-mono uppercase tracking-wider font-bold transition-all duration-300 shadow-md active:scale-95 cursor-pointer animate-fade-in"
                data-cursor-expand="true"
                data-cursor-text="KHAMSAT"
              >
                <span className={language === 'ar' ? 'font-arabic tracking-normal' : ''}>
                  {language === 'en' ? 'VISIT KHAMSAT STORE' : 'زيارة متجري على خمسات'}
                </span>
                <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </a>
            </div>
          </div>

          {/* Card B: Behance Creative Portfolio */}
          <div className="p-8 bg-[#0c0c0c]/90 border border-brand-accent/15 hover:border-brand-accent/40 relative overflow-hidden group transition-all duration-300 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-3xl group-hover:bg-brand-accent/8 animate-pulse duration-[8s]" />
            <div className="absolute top-0 left-0 w-[1px] h-0 bg-brand-accent group-hover:h-full transition-all duration-500" />
            <div className="absolute top-0 left-0 w-0 h-[1px] bg-brand-accent group-hover:w-full transition-all duration-300" />
            
            <div>
              <div className={`flex items-center gap-3 mb-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                <span className="text-[10px] font-mono text-brand-accent uppercase tracking-widest font-bold">
                  {language === 'en' ? 'BEHANCE SHOWCASE' : 'معرض أعمال بيهانس'}
                </span>
              </div>

              <h4 className={`text-base font-bold text-white mb-3 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>
                {language === 'en' ? 'Browse Visual Case Histories' : 'تصفح المشاريع والقصص البصرية'}
              </h4>

              <p className={`text-xs text-brand-beige/70 leading-relaxed mb-6 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>
                {language === 'en'
                  ? 'Examine detailed brand structures, social media campaigns, print poster systems, and visual stories curated in high quality.'
                  : 'استكشف تفاصيل بناء العلامات التجارية وكواليس المشاريع الإبداعية، وشاهد البوسترات والأنظمة البصرية المصممة بأعلى معايير الجاذبية والدقة الفنية على منصة بيهانس العالمية.'}
              </p>
            </div>

            <div className={`pt-2 ${language === 'ar' ? 'text-right' : ''}`}>
              <a 
                href="https://www.behance.net/louaimouaia" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-brand-accent text-brand-dark hover:bg-white text-[10px] font-mono uppercase tracking-wider font-bold transition-all duration-300 shadow-md active:scale-95 cursor-pointer animate-fade-in"
                data-cursor-expand="true"
                data-cursor-text="BEHANCE"
              >
                <span className={language === 'ar' ? 'font-arabic tracking-normal' : ''}>
                  {language === 'en' ? 'EXPLORE BEHANCE' : 'تصفح معرض بيهانس'}
                </span>
                <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
