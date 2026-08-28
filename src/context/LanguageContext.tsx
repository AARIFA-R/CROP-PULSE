import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, LanguageOption, translations, t as translateFn } from '../locales/translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  supportedLanguages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('crop_pulse_selected_language') as SupportedLanguage;
      if (saved && ['en', 'hi', 'es', 'pa', 'te', 'sw'].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const setLanguage = (newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem('crop_pulse_selected_language', newLang);
    } catch {
      // ignore
    }
  };

  const t = (key: string): string => {
    return translateFn(key, language);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        supportedLanguages: SUPPORTED_LANGUAGES
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback safe defaults if used outside provider
    return {
      language: 'en' as SupportedLanguage,
      setLanguage: () => {},
      t: (k: string) => translateFn(k, 'en'),
      supportedLanguages: SUPPORTED_LANGUAGES
    };
  }
  return context;
};
