import Link from 'next/link';
import { useTheme } from '@/app/providers/ThemeContext';
import type { Surah } from '@/types';

export interface SurahCardProps {
  surah: Surah;
}

export function SurahCard({ surah }: SurahCardProps) {
  const { theme } = useTheme();

  return (
    <Link
      href={`/surah/${surah.number}`}
      className="group p-4 sm:p-5 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 content-visibility-auto animate-fade-in-up bg-surface/60"
      aria-label={`Read Surah ${surah.name} (${surah.meaning}) - ${surah.verses} verses`}
    >
      <article className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg transition-colors bg-interactive text-accent group-hover:bg-accent/10"
            aria-hidden="true"
          >
            {surah.number}
          </div>
          <div>
            <h3
              className={`font-semibold text-lg ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}
            >
              {surah.name}
            </h3>
            <p className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
              {surah.meaning}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p
            className={`font-amiri text-2xl ${theme === 'light' ? 'text-slate-800 group-hover:text-accent' : 'text-slate-300 group-hover:text-accent'} transition-colors`}
            lang="ar"
          >
            {surah.arabicName}
          </p>
          <p className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
            {surah.verses} Verses
          </p>
        </div>
      </article>
    </Link>
  );
}
