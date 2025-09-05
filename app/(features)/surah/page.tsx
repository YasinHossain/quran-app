import Link from 'next/link';

import { getSurahList } from '@/lib/api';

import type { Surah } from '@/types';

export default async function SurahIndexPage() {
  const surahs: Surah[] = await getSurahList();
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
