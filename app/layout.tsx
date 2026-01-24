// app/layout.tsx
import { cookies } from 'next/headers';

import './fonts.css';
import './globals.css';
import { isUiLanguageCode } from '@/app/shared/i18n/uiLanguages';

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
 */
export const INLINE_THEME_SCRIPT = `(function(){try{var t=null;try{t=localStorage.getItem('theme')}catch(e){}if(!t){try{var m=document.cookie.match(/(?:^|; )theme=([^;]+)/);t=m?decodeURIComponent(m[1]):null}catch(e){}}if(t!=='light'&&t!=='dark'){try{var mq=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)');if(mq&&mq.matches)t='dark'}catch(e){} }var r=document.documentElement;r.classList.remove('light');r.classList.toggle('dark',t==='dark');r.setAttribute('data-theme',t==='dark'?'dark':'light');try{r.style.colorScheme=t==='dark'?'dark':'light'}catch(e){}}catch(e){}})()`;

export const INLINE_UI_LANGUAGE_SCRIPT = `(function(){try{var k='ui-language';var l=null;try{l=localStorage.getItem(k)}catch(e){}if(!l){try{var re=new RegExp('(?:^|; )'+k+'=([^;]+)');var m=document.cookie.match(re);l=m?decodeURIComponent(m[1]):null}catch(e){}}if(l!=='en'&&l!=='bn')return;var r=document.documentElement;if(r&&r.lang!==l)r.lang=l;try{var c=k+'='+encodeURIComponent(l)+'; path=/; max-age=31536000; SameSite=Lax';try{if(location&&location.protocol==='https:')c+='; Secure'}catch(e){}document.cookie=c}catch(e){}}catch(e){}})()`;

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
  const storedUiLanguage = cookieStore.get('ui-language');
  const uiLanguage =
    storedUiLanguage && isUiLanguageCode(storedUiLanguage.value) ? storedUiLanguage.value : 'en';
  const htmlClassNameByTheme: Record<'light' | 'dark', string | undefined> = {
    light: undefined,
    dark: 'dark',
  };

  return (
    <html
      lang={uiLanguage}
      data-theme={theme}
      data-glass="off"
      className={htmlClassNameByTheme[theme]}
      suppressHydrationWarning
    >
      <head>
        {/* Must run before any paint to prevent theme flash */}
        <script dangerouslySetInnerHTML={{ __html: INLINE_THEME_SCRIPT }} />
        {/* Must run before any paint to sync persisted UI language */}
        <script dangerouslySetInnerHTML={{ __html: INLINE_UI_LANGUAGE_SCRIPT }} />
        <meta name="theme-color" content="#0B1220" />
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
          <TranslationProvider initialLanguage={uiLanguage}>
            <ClientProviders initialTheme={theme} initialUiLanguage={uiLanguage}>
              {children}
            </ClientProviders>
          </TranslationProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
