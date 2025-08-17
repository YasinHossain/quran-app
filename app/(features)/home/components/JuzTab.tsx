'use client';
import Link from 'next/link';
import { useTheme } from '@/app/providers/ThemeContext';
import juzData from '@/data/juz.json';

interface JuzSummary {
  number: number;
  name: string;
  surahRange: string;
}

const allJuz: JuzSummary[] = juzData;

export default function JuzTab() {
  const { theme } = useTheme();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {allJuz.map((juz) => (
        <Link
          href={`/juz/${juz.number}`}
          key={juz.number}
          className={`group p-4 sm:p-5 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 content-visibility-auto animate-fade-in-up ${theme === 'light' ? 'bg-white/60' : 'bg-slate-800/40'}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg transition-colors ${
                  theme === 'light'
                    ? 'bg-gray-100 text-emerald-600 group-hover:bg-emerald-50/50'
                    : 'bg-slate-700/50 text-emerald-400 group-hover:bg-emerald-500/20'
                }`}
              >
                {juz.number}
              </div>
              <div>
                <h3
                  className={`font-semibold text-lg ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}
                >
                  {juz.name}
                </h3>
                <p className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                  {juz.surahRange}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
