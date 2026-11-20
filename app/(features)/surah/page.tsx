import Link from 'next/link';

import { localizeHref } from '@/app/shared/i18n/localeRouting';
import { getRequestUiLanguage, getServerTranslator } from '@/app/shared/i18n/serverLocale';
import { getSurahNavigationListServer } from '@/lib/api/server';
import { buildLocalizedPageMetadata } from '@/lib/seo/localizedMetadata';
import { SITE_NAME } from '@/lib/seo/site';

import type { Surah } from '@/types';
import type { Metadata } from 'next';

// Cache this page for 1 hour - makes subsequent visits instant
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestUiLanguage();
  const { t } = await getServerTranslator(locale);

  return buildLocalizedPageMetadata({
    path: '/surah',
    locale,
    title: t('surah_tab'),
    description: `${t('seo_surah_index_description', { siteName: SITE_NAME })} ${t(
      'seo_site_description',
      { siteName: SITE_NAME }
    )}`,
  });
}

export default async function SurahIndexPage(): Promise<React.JSX.Element> {
  const locale = await getRequestUiLanguage();
  const [translator, surahs] = await Promise.all([
    getServerTranslator(locale),
    getSurahNavigationListServer() as Promise<Surah[]>,
  ]);
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">{translator.t('surah_tab')}</h1>
      <ul className="space-y-2">
        {surahs.map((s) => (
          <li key={s.number}>
            <Link href={localizeHref(`/surah/${s.number}`, locale)}>
              {translator.chapterName({ id: s.number, name_simple: s.name })}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
