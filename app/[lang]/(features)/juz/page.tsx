import Link from 'next/link';

import { localizeHref } from '@/app/shared/i18n/localeRouting';
import {
  getPageUiLanguage,
  getServerTranslator,
  type LangParams,
} from '@/app/shared/i18n/serverLocale';
import { getAllJuzs } from '@/app/shared/navigation/datasets';
import { buildLocalizedPageMetadata } from '@/lib/seo/localizedMetadata';
import { SITE_NAME } from '@/lib/seo/site';

import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const locale = await getPageUiLanguage(params);
  const { t } = await getServerTranslator(locale);

  return buildLocalizedPageMetadata({
    path: '/juz',
    locale,
    title: t('juz_tab'),
    description: t('seo_juz_index_description', { siteName: SITE_NAME }),
  });
}

export default async function JuzIndexPage({
  params,
}: {
  params: LangParams;
}): Promise<React.JSX.Element> {
  const locale = await getPageUiLanguage(params);
  const { t } = await getServerTranslator(locale);
  const juzs = getAllJuzs();
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">{t('juz_tab')}</h1>
      <ul className="space-y-2">
        {juzs.map((j) => (
          <li key={j.number}>
            <Link href={localizeHref(`/juz/${j.number}`, locale)}>
              {t('juz_number', { number: j.number })}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
