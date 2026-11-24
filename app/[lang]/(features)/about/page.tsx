import Link from 'next/link';

import { localizeHref } from '@/app/shared/i18n/localeRouting';
import {
  getPageUiLanguage,
  getServerTranslator,
  type LangParams,
} from '@/app/shared/i18n/serverLocale';
import {
  getReciterResourcesServer,
  getTranslationResourcesServer,
} from '@/lib/api/server/resources';
import { getTafsirResourcesServer } from '@/lib/api/server/tafsir';
import { buildLocalizedPageMetadata, localizedUrl } from '@/lib/seo/localizedMetadata';
import { GITHUB_ISSUES_URL, SITE_NAME, buildOrganizationJsonLd, getSiteUrl } from '@/lib/seo/site';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import {
  ARABIC_FONT_CREDITS,
  CONTENT_PROVIDER_CREDITS,
  TRANSLITERATION_RESOURCE_ID,
  WORD_DATA_CREDITS,
  type SourceCredit,
} from './aboutSources';

import type { Metadata } from 'next';

// The resource lists come from the API and rarely change: cache for a day (ISR).
export const revalidate = 86400;

const ABOUT_PATH = '/about';

interface NamedItem {
  key: string;
  label: string;
}
interface LanguageGroup {
  language: string;
  items: NamedItem[];
}

const compareText = (a: string, b: string): number =>
  a.localeCompare(b, undefined, { sensitivity: 'base' });

const capitalizeWords = (value: string): string =>
  value
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

/** English first, then Bengali (like the settings panels), then alphabetical. */
const compareLanguages = (a: string, b: string): number => {
  if (a === 'English') return -1;
  if (b === 'English') return 1;
  if (a === 'Bengali') return -1;
  if (b === 'Bengali') return 1;
  return compareText(a, b);
};

function groupByLanguage(
  entries: ReadonlyArray<{ language: string; item: NamedItem }>,
  otherLabel: string
): LanguageGroup[] {
  const groups = new Map<string, NamedItem[]>();
  for (const { language, item } of entries) {
    const key = capitalizeWords(language.trim()) || otherLabel;
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => compareLanguages(a, b))
    .map(([language, items]) => ({
      language,
      items: items.sort((a, b) => compareText(a.label, b.label)),
    }));
}

/**
 * Runs a resource fetch. A failure (or an empty list) throws, so the cached (ISR) page is never
 * stored with a missing source list; the last good version keeps being served instead.
 */
async function loadList<T>(name: string, load: () => Promise<T[]>): Promise<T[]> {
  try {
    const items = await load();
    if (items.length === 0) throw new Error(`No ${name} returned`);
    return items;
  } catch (error) {
    const reason = error instanceof Error ? error : new Error(String(error));
    logger.error(`About page: failed to load ${name}`, undefined, reason);
    throw reason;
  }
}

export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const locale = await getPageUiLanguage(params);
  const { t } = await getServerTranslator(locale);

  return buildLocalizedPageMetadata({
    path: ABOUT_PATH,
    locale,
    title: t('about_page_title'),
    description: t('about_seo_description', { siteName: SITE_NAME }),
  });
}

function CreditList({
  credits,
  t,
}: {
  credits: readonly SourceCredit[];
  t: (key: string) => string;
}): React.JSX.Element {
  return (
    <ul className="space-y-4">
      {credits.map((credit) => (
        <li key={credit.id}>
          <p className="font-medium text-foreground">
            {credit.url ? (
              <a
                href={credit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                {credit.title}
              </a>
            ) : (
              credit.title
            )}
          </p>
          <p className="text-sm text-foreground/90" dir="ltr">
            {credit.credit}
          </p>
          {credit.usageKey ? <p className="text-sm text-muted">{t(credit.usageKey)}</p> : null}
          {credit.license ? (
            <p className="text-sm text-muted">
              {t('about_license_label')}: <span dir="ltr">{credit.license}</span>
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function GroupedList({
  groups,
  unavailable,
  t,
}: {
  groups: LanguageGroup[] | null;
  unavailable: boolean;
  t: (key: string) => string;
}): React.JSX.Element {
  if (unavailable || !groups) {
    return <p className="text-sm text-muted">{t('about_list_unavailable')}</p>;
  }
  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <div key={group.language}>
          <h3 className="font-medium text-foreground mb-2" dir="ltr">
            {group.language}
          </h3>
          <ul className="list-disc ps-6 space-y-1 text-sm text-foreground/90">
            {group.items.map((item) => (
              <li key={item.key} dir="auto">
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

const SECTION_HEADING = 'text-xl font-semibold text-foreground mb-4';

export default async function AboutPage({
  params,
}: {
  params: LangParams;
}): Promise<React.JSX.Element> {
  const locale = await getPageUiLanguage(params);
  const { t } = await getServerTranslator(locale);

  const [translations, tafsirs, reciters] = await Promise.all([
    loadList('translations', getTranslationResourcesServer),
    loadList('tafsirs', getTafsirResourcesServer),
    loadList('reciters', () => getReciterResourcesServer(locale)),
  ]);
  const other = t('about_language_other');

  const translationGroups =
    translations &&
    groupByLanguage(
      translations
        .filter((translation) => translation.id !== TRANSLITERATION_RESOURCE_ID)
        .map((translation) => ({
          language: translation.lang,
          item: { key: String(translation.id), label: translation.name },
        })),
      other
    );
  const tafsirGroups =
    tafsirs &&
    groupByLanguage(
      tafsirs.map((tafsir) => ({
        language: tafsir.lang,
        item: { key: String(tafsir.id), label: tafsir.name },
      })),
      other
    );
  const reciterItems =
    reciters &&
    reciters
      .map((reciter) => ({
        key: String(reciter.id),
        label: reciter.style ? `${reciter.name} (${reciter.style})` : reciter.name,
      }))
      .sort((a, b) => compareText(a.label, b.label));

  const siteUrl = getSiteUrl();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: t('about_page_title'),
    description: t('about_seo_description', { siteName: SITE_NAME }),
    url: localizedUrl(ABOUT_PATH, locale),
    inLanguage: locale,
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: siteUrl },
    publisher: buildOrganizationJsonLd(),
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('about_page_title')}
          </h1>
        </header>

        <article className="space-y-10">
          <section>
            <h2 className={SECTION_HEADING}>{t('about_heading_about', { siteName: SITE_NAME })}</h2>
            <p className="text-foreground/90 leading-relaxed mb-3">
              {t('seo_site_description', { siteName: SITE_NAME })}
            </p>
            <p className="text-foreground/90 leading-relaxed">
              {t('about_not_ai', { siteName: SITE_NAME })}
            </p>
          </section>

          <section>
            <h2 className={SECTION_HEADING}>{t('about_heading_report')}</h2>
            <p className="text-foreground/90 leading-relaxed mb-3">{t('about_report_body')}</p>
            <a
              href={GITHUB_ISSUES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              {t('about_report_link')}
            </a>
          </section>

          <section>
            <h2 className={SECTION_HEADING}>{t('about_heading_sources')}</h2>
            <CreditList credits={CONTENT_PROVIDER_CREDITS} t={t} />
          </section>

          <section>
            <h2 className={SECTION_HEADING}>{t('about_heading_word_data')}</h2>
            <CreditList credits={WORD_DATA_CREDITS} t={t} />
          </section>

          <section>
            <h2 className={SECTION_HEADING}>{t('about_heading_fonts')}</h2>
            <CreditList credits={ARABIC_FONT_CREDITS} t={t} />
          </section>

          <section>
            <h2 className={SECTION_HEADING}>{t('about_heading_translations')}</h2>
            <GroupedList groups={translationGroups} unavailable={!translations} t={t} />
          </section>

          <section>
            <h2 className={SECTION_HEADING}>{t('about_heading_tafsirs')}</h2>
            <GroupedList groups={tafsirGroups} unavailable={!tafsirs} t={t} />
          </section>

          <section>
            <h2 className={SECTION_HEADING}>{t('about_heading_reciters')}</h2>
            {reciterItems ? (
              <ul className="list-disc ps-6 space-y-1 text-sm text-foreground/90">
                {reciterItems.map((item) => (
                  <li key={item.key} dir="auto">
                    {item.label}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">{t('about_list_unavailable')}</p>
            )}
          </section>
        </article>

        <footer className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-wrap gap-6 text-sm text-muted">
            <Link href="/privacy" className="hover:text-accent transition-colors">
              {t('home_footer_privacy_policy')}
            </Link>
            <Link href="/terms" className="hover:text-accent transition-colors">
              {t('home_footer_terms_of_use')}
            </Link>
            <Link href={localizeHref('/', locale)} className="hover:text-accent transition-colors">
              {t('home')}
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
