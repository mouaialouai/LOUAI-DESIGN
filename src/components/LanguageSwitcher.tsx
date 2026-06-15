import { useLanguage } from './LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div 
      id="language-switcher" 
      className="flex items-center gap-2 font-mono text-[10px] tracking-widest select-none z-40"
    >
      <button
        onClick={() => setLanguage('en')}
        className={`transition-colors duration-300 font-bold ${
          language === 'en' ? 'text-brand-accent font-black' : 'text-brand-beige/40 hover:text-brand-beige'
        }`}
        id="btn-lang-en"
        data-cursor-expand="true"
      >
        EN
      </button>
      
      <span className="text-white/20 select-none font-light">|</span>
      
      <button
        onClick={() => setLanguage('ar')}
        className={`transition-colors duration-300 font-arabic font-bold text-xs ${
          language === 'ar' ? 'text-brand-accent font-black' : 'text-brand-beige/40 hover:text-brand-beige'
        }`}
        id="btn-lang-ar"
        data-cursor-expand="true"
      >
        العربية
      </button>
    </div>
  );
}
