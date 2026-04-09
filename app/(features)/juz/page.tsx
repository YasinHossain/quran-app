import Link from 'next/link';

import { getAllJuzs } from '@/app/shared/navigation/datasets';
import { SITE_NAME, absoluteUrl } from '@/lib/seo/site';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Juz',
  description: `Browse all 30 juz of the Holy Quran on ${SITE_NAME}.`,
  alternates: {
    canonical: absoluteUrl('/juz'),
  },
  openGraph: {
    title: `Juz | ${SITE_NAME}`,
    description: `Browse all 30 juz of the Holy Quran on ${SITE_NAME}.`,
    url: absoluteUrl('/juz'),
  },
  twitter: {
    title: `Juz | ${SITE_NAME}`,
    description: `Browse all 30 juz of the Holy Quran on ${SITE_NAME}.`,
  },
};

export default function JuzIndexPage(): React.JSX.Element {
  const juzs = getAllJuzs();
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Juz</h1>
      <ul className="space-y-2">
        {juzs.map((j) => (
          <li key={j.number}>
            <Link href={`/juz/${j.number}`}>{j.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
