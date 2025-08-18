import Link from 'next/link';
import type { Surah } from '@/types';

export interface SurahCardProps {
  surah: Surah;
}

export function SurahCard({ surah }: SurahCardProps) {
  return (
    <Link
      href={`/surah/${surah.number}`}
      className="group p-4 sm:p-5 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 content-visibility-auto animate-fade-in-up bg-surface/60"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg transition-colors bg-surface text-accent group-hover:bg-accent/10">
            {surah.number}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">{surah.name}</h3>
            <p className="text-sm text-muted">{surah.meaning}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-amiri text-2xl text-foreground group-hover:text-accent transition-colors">
            {surah.arabicName}
          </p>
          <p className="text-sm text-muted">{surah.verses} Verses</p>
        </div>
      </div>
    </Link>
  );
}
