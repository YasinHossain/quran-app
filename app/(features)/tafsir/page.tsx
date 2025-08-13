import Link from 'next/link';
import surahData from '@/data/surahs.json';

interface SurahSummary {
  number: number;
  name: string;
}

export default function TafsirIndexPage() {
  const surahs = surahData as SurahSummary[];
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
