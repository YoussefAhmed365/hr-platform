'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getAuthTranslations, type AuthTranslations } from '../../lib/auth/i18n';

interface AuthLanguageContextType {
  lang: 'ar' | 'en';
  dir: 'rtl' | 'ltr';
  t: AuthTranslations;
  toggleLang: () => void;
  setLang: (lang: 'ar' | 'en') => void;
}

const AuthLanguageContext = createContext<AuthLanguageContextType | null>(null);

export function AuthLanguageProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: string;
}) {
  const [lang, setLangState] = useState<'ar' | 'en'>(
    initialLocale === 'ar' ? 'ar' : 'en'
  );
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const t = getAuthTranslations(lang);

  // Update html dir/lang when language changes
  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);
  }, [dir, lang]);

  const setLang = useCallback((newLang: 'ar' | 'en') => {
    setLangState(newLang);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  }, []);

  return (
    <AuthLanguageContext.Provider value={{ lang, dir, t, toggleLang, setLang }}>
      {children}
    </AuthLanguageContext.Provider>
  );
}

export function useAuthLanguage() {
  const ctx = useContext(AuthLanguageContext);
  if (!ctx) {
    throw new Error('useAuthLanguage must be used within AuthLanguageProvider');
  }
  return ctx;
}
