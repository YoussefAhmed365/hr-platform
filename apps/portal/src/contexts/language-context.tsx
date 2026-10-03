import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

type Lang = 'ar' | 'en';
type Dir = 'rtl' | 'ltr';

interface LanguageContextType {
  lang: Lang;
  dir: Dir;
  toggleLang: () => void;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

/**
 * Detects the preferred language from URL search params, localStorage, or browser settings.
 */
function detectLanguage(): Lang {
  // Check URL param first (e.g., ?lang=ar when redirected from landing)
  const params = new URLSearchParams(window.location.search);
  const urlLang = params.get('lang');
  if (urlLang === 'ar' || urlLang === 'en') return urlLang;

  // Check localStorage
  const stored = localStorage.getItem('portal_lang');
  if (stored === 'ar' || stored === 'en') return stored;

  // Check browser language
  const browserLang = navigator.language.slice(0, 2);
  if (browserLang === 'ar') return 'ar';

  return 'en'; // Default to English
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLanguage);
  const dir: Dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('portal_lang', lang);
  }, [dir, lang]);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, dir, toggleLang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
