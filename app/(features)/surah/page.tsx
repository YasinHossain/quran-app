import Link from 'next/link';

import { getSurahNavigationListServer } from '@/lib/api/server';
import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from '@/lib/seo/site';

import type { Surah } from '@/types';
import type { Metadata } from 'next';

// Cache this page for 1 hour - makes subsequent visits instant
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Surah',
  description: `Browse all surahs of the Holy Quran on ${SITE_NAME}. ${SITE_DESCRIPTION}`,
  alternates: {
    canonical: absoluteUrl('/surah'),
  },
};

export default async function SurahIndexPage(): Promise<React.JSX.Element> {
  const surahs: Surah[] = await getSurahNavigationListServer();
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Surah</h1>
      <ul className="space-y-2">
        {surahs.map((s) => (
          <li key={s.number}>
            <Link href={`/surah/${s.number}`}>{s.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
