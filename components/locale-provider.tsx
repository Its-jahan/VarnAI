'use client';

import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

interface LocaleContextValue {
  locale: string;
  direction: 'ltr' | 'rtl';
  setLocale: (next: string) => void;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({ locale: defaultLocale, children }: { locale: string; children: ReactNode }) {
  const [locale, setLocale] = useState(defaultLocale);
  const value = useMemo<LocaleContextValue>(() => ({
    locale,
    direction: locale === 'fa' ? 'rtl' : 'ltr',
    setLocale,
  }), [locale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
