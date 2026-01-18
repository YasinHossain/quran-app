// app/layout.tsx
import { cookies } from 'next/headers';

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

/**
 * CRITICAL: Inline theme script to prevent FOUC (Flash of Unstyled Content).
 * This script runs synchronously before any paint occurs to set the correct theme class.
 * Must use dangerouslySetInnerHTML instead of next/Script for truly synchronous execution.
 */
export const INLINE_THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(!t){var m=document.cookie.match(/(?:^|; )theme=([^;]+)/);t=m?m[1]:null}if(t==='dark'){document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme','dark')}else{document.documentElement.classList.remove('dark');document.documentElement.setAttribute('data-theme',t||'light')}}catch(e){}})()`;

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
    <html lang="en" data-theme={theme} className={theme} suppressHydrationWarning>
      <head>
        {/* 
          CRITICAL: Synchronous theme script to prevent FOUC.
          This MUST run before any content is painted.
          Using dangerouslySetInnerHTML ensures it's inline in the HTML, not injected by JS.
        */}
        <script dangerouslySetInnerHTML={{ __html: INLINE_THEME_SCRIPT }} />
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
