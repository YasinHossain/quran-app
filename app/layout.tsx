// app/layout.tsx
import {
  Inter,
  Noto_Sans_Arabic,
  Noto_Sans_Bengali,
  Crimson_Text,
  Libre_Baskerville,
} from 'next/font/google';
import localFont from 'next/font/local';
import { cookies } from 'next/headers';
import Script from 'next/script';

import { ClientProviders } from './providers/ClientProviders';
import { TranslationProvider } from './providers/TranslationProvider';
import { ErrorBoundary } from './shared/components/error-boundary';

import './fonts.css';
import './globals.css';

const kfgqpc = localFont({
  src: '../public/fonts/KFGQPC-Uthman-Taha.ttf',
  variable: '--font-kfgqpc',
  display: 'swap',
});

const nastaliq = localFont({
  src: '../public/fonts/Noto Nastaliq Urdu.ttf',
  variable: '--font-nastaliq',
  display: 'swap',
});

const amiri = localFont({
  src: '../public/fonts/Amiri.ttf',
  variable: '--font-amiri',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const arabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-noto-sans-arabic',
  display: 'swap',
});

const bengali = Noto_Sans_Bengali({
  subsets: ['bengali', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-bengali',
  display: 'swap',
  preload: true,
});

const crimsonText = Crimson_Text({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-crimson-text',
  display: 'swap',
});

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-libre-baskerville',
  display: 'swap',
});

export const INLINE_THEME_SCRIPT = `(() => {
  try {
    var t = localStorage.getItem('theme');
    if (!t) {
      var m = document.cookie.match(/(?:^|; )theme=([^;]+)/);
      t = m ? m[1] : null;
    }
    document.documentElement.classList.toggle('dark', t === 'dark');
    document.documentElement.setAttribute('data-theme', t || 'light');
  } catch (e) {}
})();`;

export const metadata = {
  title: 'Quran Mazid',
  description: 'Read, Study, and Learn The Holy Quran',
};

export default async function RootLayout({ children }: { children: React.ReactNode }): Promise<React.JSX.Element> {
  const cookieStore = await cookies();
  const stored = cookieStore.get('theme');
  const theme =
    stored && (stored.value === 'light' || stored.value === 'dark')
      ? (stored.value as 'light' | 'dark')
      : 'light';

  return (
    <html lang="en" data-theme={theme} className={theme}>
      <head>
        <Script id="theme-script" strategy="beforeInteractive">
          {INLINE_THEME_SCRIPT}
        </Script>
      </head>
      <body
        className={`font-sans ${kfgqpc.variable} ${nastaliq.variable} ${amiri.variable} ${arabic.variable} ${bengali.variable} ${crimsonText.variable} ${libreBaskerville.variable} ${inter.className}`}
      >
        <ErrorBoundary>
          <TranslationProvider>
            <ClientProviders initialTheme={theme}>{children}</ClientProviders>
          </TranslationProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
