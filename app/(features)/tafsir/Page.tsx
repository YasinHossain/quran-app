import Link from 'next/link';

import { getSurahList } from '@/lib/api';

import type { Surah } from '@/types';

export default async function TafsirIndexPage(): Promise<React.JSX.Element> {
  const surahs: Surah[] = await getSurahList();
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Tafsir</h1>
      <ul className="space-y-2">
        {surahs.map((s) => (
          <li key={s.number}>
            <Link href={`/tafsir/${s.number}`}>{s.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
