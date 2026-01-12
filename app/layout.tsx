// app/layout.tsx
import { cookies } from 'next/headers';
import Script from 'next/script';

import './fonts.css';
import './globals.css';
import { ClientProviders } from './providers/ClientProviders';
import { TranslationProvider } from './providers/TranslationProvider';
import { ErrorBoundary } from './shared/components/error-boundary';
import { WebVitals } from './shared/components/WebVitals';

/**
 * FONT LOADING STRATEGY (Performance Optimized):
 *
 * 1. CRITICAL (Preloaded):
 *    - UthmanicHafs1Ver18.woff2 - Default Arabic font, preloaded in <head>
 *
 * 2. UI FONTS (Loaded via CSS):
 *    - Inter - Local woff2 files with font-display: swap
 *
 * 3. ARABIC FONTS (Lazy loaded):
 *    - All other Arabic fonts loaded via useDynamicFontLoader when user selects them
 *
 * 4. TRANSLATION FONTS (Lazy loaded):
 *    - Bengali, Crimson Text, Libre Baskerville - loaded when needed
 *
 * This strategy reduces initial font requests from 7+ to just 2,
 * significantly improving LCP (Largest Contentful Paint).
 */

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
  title: 'Al Quran',
  description: 'Read, Study, and Learn The Holy Quran',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.JSX.Element> {
  const cookieStore = await cookies();
  const stored = cookieStore.get('theme');
  const theme =
    stored && (stored.value === 'light' || stored.value === 'dark')
      ? (stored.value as 'light' | 'dark')
      : 'light';

  return (
    <html lang="en" data-theme={theme} className={theme}>
      <head>
        {/* Preload critical Arabic font to reduce request chain */}
        <link
          rel="preload"
          href="/fonts/UthmanicHafs1Ver18.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Preload critical UI font */}
        <link
          rel="preload"
          href="/fonts/Inter-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <Script id="theme-script" strategy="beforeInteractive">
          {INLINE_THEME_SCRIPT}
        </Script>
      </head>
      <body className="font-sans">
        <WebVitals />
        <ErrorBoundary>
          <TranslationProvider>
            <ClientProviders initialTheme={theme}>{children}</ClientProviders>
          </TranslationProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
