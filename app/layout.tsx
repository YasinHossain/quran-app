// app/layout.tsx
import { cookies, headers } from 'next/headers';
import type { Metadata } from 'next';

import './fonts.css';
import './globals.css';
import { getUiLanguageDirection, isUiLanguageCode } from '@/app/shared/i18n/uiLanguages';
import { loadUiResources } from '@/app/shared/i18n/loadUiResources';
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, absoluteUrl, getSiteUrl } from '@/lib/seo/site';

import { ClientProviders } from './providers/ClientProviders';
import { TranslationProvider } from './providers/TranslationProvider';
import { ErrorBoundary } from './shared/components/error-boundary';
import { WebVitals } from './shared/components/WebVitals';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

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

export const INLINE_UI_LANGUAGE_SCRIPT = `(function(){try{var k='ui-language';var s=['en','bn','ar','ur','hi'];var l=null;try{var p=location&&location.pathname?location.pathname.split('/')[1]:null;if(p){p=p.toLowerCase();if(s.indexOf(p)>-1)l=p}}catch(e){}if(!l){try{l=localStorage.getItem(k)}catch(e){}}if(!l){try{var re=new RegExp('(?:^|; )'+k+'=([^;]+)');var m=document.cookie.match(re);l=m?decodeURIComponent(m[1]):null}catch(e){}}if(!l||s.indexOf(l)===-1)return;var r=document.documentElement;if(r){if(r.lang!==l)r.lang=l;try{r.dir=(l==='ar'||l==='ur')?'rtl':'ltr'}catch(e){}}try{var c=k+'='+encodeURIComponent(l)+'; path=/; max-age=31536000; SameSite=Lax';try{if(location&&location.protocol==='https:')c+='; Secure'}catch(e){}document.cookie=c}catch(e){}}catch(e){}})()`;

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  applicationName: SITE_NAME,
  description: SITE_DESCRIPTION,
  keywords: [...SITE_KEYWORDS],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'education',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} – Quran app`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ['/twitter-image'],
  },
} satisfies Metadata;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.JSX.Element> {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const stored = cookieStore.get('theme');
  const theme =
    stored && (stored.value === 'light' || stored.value === 'dark')
      ? (stored.value as 'light' | 'dark')
      : 'light';
  const uiLanguageHeader = headerStore.get('x-ui-language');
  const storedUiLanguage = cookieStore.get('ui-language');
  const uiLanguage =
    (uiLanguageHeader && isUiLanguageCode(uiLanguageHeader) ? uiLanguageHeader : null) ??
    (storedUiLanguage && isUiLanguageCode(storedUiLanguage.value) ? storedUiLanguage.value : 'en');
  const resources = await loadUiResources(uiLanguage);
  const htmlClassNameByTheme: Record<'light' | 'dark', string | undefined> = {
    light: undefined,
    dark: 'dark',
  };

  const siteUrl = getSiteUrl();
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: siteUrl,
      logo: absoluteUrl('/icons/icon-512x512.png'),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: siteUrl,
      description: SITE_DESCRIPTION,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/search?query={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: SITE_NAME,
      url: siteUrl,
      applicationCategory: 'EducationApplication',
      operatingSystem: 'Web',
      description: SITE_DESCRIPTION,
    },
  ];

  return (
    <html
      lang={uiLanguage}
      dir={getUiLanguageDirection(uiLanguage)}
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
        <SpeedInsights />
        <Analytics />
        <ErrorBoundary>
          <TranslationProvider initialLanguage={uiLanguage} resources={resources}>
            <ClientProviders initialTheme={theme} initialUiLanguage={uiLanguage}>
              {children}
            </ClientProviders>
          </TranslationProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
