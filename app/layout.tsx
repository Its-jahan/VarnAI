import './globals.css';

import { Inter, Vazirmatn } from 'next/font/google';
import { ReactNode } from 'react';
import { dir } from 'i18next';
import { ThemeProvider } from '@/components/theme-provider';
import { LocaleProvider } from '@/components/locale-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const vazir = Vazirmatn({ subsets: ['arabic'], variable: '--font-vazir' });

export const metadata = {
  title: 'AI Trainer Dashboard',
  description: 'Build, train, and evaluate AI agents collaboratively.',
};

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fa' }];
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const locale = 'en';
  return (
    <html lang={locale} dir={dir(locale)} suppressHydrationWarning>
      <body className={`${inter.variable} ${vazir.variable} min-h-screen bg-background font-sans antialiased`}>
        <LocaleProvider locale={locale}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
