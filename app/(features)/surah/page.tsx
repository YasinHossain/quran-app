import Link from 'next/link';
import surahData from '@/data/surahs.json';

interface SurahSummary {
  number: number;
  name: string;
}

export default function SurahIndexPage() {
  const surahs = surahData as SurahSummary[];
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
