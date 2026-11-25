// app/[lang]/layout.tsx
import { Suspense } from 'react';

import type { Metadata } from 'next';

import '@/app/fonts.css';
import '@/app/globals.css';
import { buildInlineUiLanguageScript } from '@/app/shared/i18n/inlineUiLanguageScript';
import { getPageUiLanguage, type LangParams } from '@/app/shared/i18n/serverLocale';
import {
  UI_LANGUAGES,
  getUiLanguageDirection,
  type UiLanguageCode,
} from '@/app/shared/i18n/uiLanguages';
import { loadUiResources } from '@/app/shared/i18n/loadUiResources';
import { ClientProviders } from '@/app/providers/ClientProviders';
import { TranslationProvider } from '@/app/providers/TranslationProvider';
import { ErrorBoundary } from '@/app/shared/components/error-boundary';
import { WebVitals } from '@/app/shared/components/WebVitals';
import { RouteProgressBar } from '@/app/shared/navigation/progress/RouteProgressBar';
import { SITE_OPENGRAPH_IMAGE, SITE_TWITTER_IMAGE } from '@/lib/seo/localizedMetadata';
import {
  GOOGLE_SITE_VERIFICATION,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  buildOrganizationJsonLd,
  getSiteUrl,
} from '@/lib/seo/site';

import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

// Vercel sets `VERCEL=1` at build and run time; other hosts (Cloudflare Workers) leave it unset.
const IS_VERCEL = Boolean(process.env['VERCEL']);

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
 *    - Noto Sans Bengali (unicode-range, only on Bengali text), Libre Baskerville - loaded when needed
 *
 * This strategy reduces initial font requests from 7+ to just 2,
 * significantly improving LCP (Largest Contentful Paint).
 */

/**
 * CRITICAL: Inline theme script to prevent FOUC (Flash of Unstyled Content).
 * This script runs synchronously before any paint occurs to set the correct theme class.
 */
export const INLINE_THEME_SCRIPT = `(function(){try{var t=null;try{t=localStorage.getItem('theme')}catch(e){}if(!t){try{var m=document.cookie.match(/(?:^|; )theme=([^;]+)/);t=m?decodeURIComponent(m[1]):null}catch(e){}}if(t!=='light'&&t!=='dark'){try{var mq=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)');if(mq&&mq.matches)t='dark'}catch(e){} }var r=document.documentElement;r.classList.remove('light');r.classList.toggle('dark',t==='dark');r.setAttribute('data-theme',t==='dark'?'dark':'light');try{r.style.colorScheme=t==='dark'?'dark':'light'}catch(e){}}catch(e){}})()`;

export const INLINE_UI_LANGUAGE_SCRIPT = buildInlineUiLanguageScript();

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  applicationName: SITE_NAME,
  description: SITE_DESCRIPTION,
  // A static file in `public/`, not `app/favicon.ico`: OpenNext's cache stores `image/x-icon` route
  // bodies as UTF-8 text and serves a corrupted icon (the type is missing from its binary list).
  icons: { icon: [{ url: '/favicon.ico', type: 'image/x-icon', sizes: '16x16' }] },
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
    images: [SITE_OPENGRAPH_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [SITE_TWITTER_IMAGE],
  },
  ...(GOOGLE_SITE_VERIFICATION ? { verification: { google: GOOGLE_SITE_VERIFICATION } } : {}),
} satisfies Metadata;

/**
 * One prerendered shell per enabled UI language. `proxy.ts` serves unprefixed (English) URLs from
 * `/en/...` and passes `/<code>/...` through, so the language comes from the URL, not the request,
 * and pages can be cached. No `dynamicParams = false` here: it would apply to every child route and
 * stop verse/tafsir pages from rendering on demand; unknown codes 404 in `getPageUiLanguage`.
 */
export function generateStaticParams(): Array<{ lang: UiLanguageCode }> {
  return UI_LANGUAGES.map(({ code }) => ({ lang: code }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: LangParams;
}): Promise<React.JSX.Element> {
  const uiLanguage = await getPageUiLanguage(params);
  const resources = await loadUiResources(uiLanguage);

  const siteUrl = getSiteUrl();
  const jsonLd = [
    buildOrganizationJsonLd(),
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
      // The theme is per visitor, so the cached HTML is always light; `INLINE_THEME_SCRIPT` applies
      // the saved or system theme before first paint (hence `suppressHydrationWarning`).
      data-theme="light"
      data-glass="off"
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
        {/* `useSearchParams` needs a Suspense boundary so it doesn't opt pages out of prerendering. */}
        <Suspense fallback={null}>
          <RouteProgressBar />
        </Suspense>
        {/* Vercel-only: these post to `/_vercel/*`, which exists only on Vercel deployments. */}
        {IS_VERCEL ? (
          <>
            <SpeedInsights />
            <Analytics />
          </>
        ) : null}
        <ErrorBoundary>
          <TranslationProvider initialLanguage={uiLanguage} resources={resources}>
            <ClientProviders initialTheme="light" initialUiLanguage={uiLanguage}>
              {children}
            </ClientProviders>
          </TranslationProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
