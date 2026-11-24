import Link from 'next/link';

import { localizeHref } from '@/app/shared/i18n/localeRouting';
import {
  getPageUiLanguage,
  getServerTranslator,
  type LangParams,
} from '@/app/shared/i18n/serverLocale';
import { buildTafsirRoute } from '@/app/shared/navigation/routes';
import { getSurahNavigationListServer } from '@/lib/api/server';
import { buildLocalizedPageMetadata } from '@/lib/seo/localizedMetadata';
import { SITE_NAME } from '@/lib/seo/site';

import type { Surah } from '@/types';
import type { Metadata } from 'next';

// Quran content does not change: cache for a day (ISR).
export const revalidate = 86400;

export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const locale = await getPageUiLanguage(params);
  const { t } = await getServerTranslator(locale);

  return buildLocalizedPageMetadata({
    path: '/tafsir',
    locale,
    title: t('tafsir_panel_title'),
    description: t('seo_tafsir_index_description', { siteName: SITE_NAME }),
  });
}

export default async function TafsirIndexPage({
  params,
}: {
  params: LangParams;
}): Promise<React.JSX.Element> {
  const locale = await getPageUiLanguage(params);
  const [translator, surahs] = await Promise.all([
    getServerTranslator(locale),
    getSurahNavigationListServer() as Promise<Surah[]>,
  ]);
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">{translator.t('tafsir_panel_title')}</h1>
      <ul className="space-y-2">
        {surahs.map((s) => (
          <li key={s.number}>
            <Link href={localizeHref(buildTafsirRoute(s.number, 1), locale)}>
              {translator.chapterName({ id: s.number, name_simple: s.name })}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
