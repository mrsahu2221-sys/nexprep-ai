import { createContext, useContext, useState, useEffect } from 'react';
import translations from '../data/translations';

const LanguageContext = createContext();

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'mr', name: 'मराठी' },
  { code: 'gu', name: 'ગુજરાતી' },
];

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('prepmaster_lang') || '');

  useEffect(() => {
    if (lang) localStorage.setItem('prepmaster_lang', lang);
  }, [lang]);

  const t = (key) => {
    const l = lang || 'en';
    return translations[l]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
