import Link from 'next/link';
import { headers } from 'next/headers';
import type { Metadata } from 'next';

import { buildTafsirRoute } from '@/app/shared/navigation/routes';
import { localizeHref } from '@/app/shared/i18n/localeRouting';
import { isUiLanguageCode } from '@/app/shared/i18n/uiLanguages';
import { getSurahList } from '@/lib/api';
import { SITE_NAME, absoluteUrl } from '@/lib/seo/site';

import type { Surah } from '@/types';

export const metadata: Metadata = {
  title: 'Tafsir',
  description: `Browse tafsir by surah and verse on ${SITE_NAME}.`,
  alternates: {
    canonical: absoluteUrl('/tafsir'),
  },
};

export default async function TafsirIndexPage(): Promise<React.JSX.Element> {
  const headerStore = await headers();
  const fromHeader = headerStore.get('x-ui-language');
  const locale = fromHeader && isUiLanguageCode(fromHeader) ? fromHeader : 'en';
  const surahs: Surah[] = await getSurahList();
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Tafsir</h1>
      <ul className="space-y-2">
        {surahs.map((s) => (
          <li key={s.number}>
            <Link href={localizeHref(buildTafsirRoute(s.number, 1), locale)}>{s.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
