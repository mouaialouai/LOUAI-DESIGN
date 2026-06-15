import React, { createContext, useContext, useState, useEffect } from 'react';
import { Translation } from '../types';
import { TRANSLATIONS } from '../data';

interface LanguageContextProps {
  language: 'en' | 'ar';
  dir: 'ltr' | 'rtl';
  t: Translation;
  setLanguage: (lang: 'en' | 'ar') => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<'en' | 'ar'>('en');

  // Load language preference from local storage if available
  useEffect(() => {
    const saved = localStorage.getItem('lm-portfolio-lang');
    if (saved === 'en' || saved === 'ar') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: 'en' | 'ar') => {
    setLanguageState(lang);
    localStorage.setItem('lm-portfolio-lang', lang);
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'ar' : 'en';
    setLanguage(next);
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const t = TRANSLATIONS[language];

  // Update HTML tag dir attribute and lang attribute Reactively
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    
    // Smooth transition style changes or font adjustments on root
    if (language === 'ar') {
      document.documentElement.classList.add('font-arabic');
      document.documentElement.classList.remove('font-sans');
    } else {
      document.documentElement.classList.add('font-sans');
      document.documentElement.classList.remove('font-arabic');
    }
  }, [language, dir]);

  return (
    <LanguageContext.Provider value={{ language, dir, t, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
