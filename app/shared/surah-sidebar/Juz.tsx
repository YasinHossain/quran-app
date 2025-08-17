import Link from 'next/link';
import type { Chapter } from '@/types';
import { getSurahByPage, JUZ_START_PAGES } from '@/lib/utils/surah-navigation';

interface JuzSummary {
  number: number;
  name: string;
  surahRange: string;
}

interface Props {
  juzs: JuzSummary[];
  chapters: Chapter[];
  theme: string;
  selectedJuzId: string | null;
  setSelectedJuzId: (id: string) => void;
  setSelectedPageId: (id: string) => void;
  setSelectedSurahId: (id: string) => void;
  rememberScroll: () => void;
}

const Juz = ({
  juzs,
  chapters,
  theme,
  selectedJuzId,
  setSelectedJuzId,
  setSelectedPageId,
  setSelectedSurahId,
  rememberScroll,
}: Props) => (
  <ul className="space-y-2">
    {juzs.map((juz) => {
      const isActive = String(juz.number) === selectedJuzId;
      return (
        <li key={juz.number}>
          <Link
            href={`/juz/${juz.number}`}
            scroll={false}
            data-active={isActive}
            onClick={() => {
              setSelectedJuzId(String(juz.number));
              const page = JUZ_START_PAGES[juz.number - 1];
              setSelectedPageId(String(page));
              const chap = getSurahByPage(page, chapters);
              if (chap) setSelectedSurahId(String(chap.id));
              rememberScroll();
            }}
            className={`group flex items-center p-4 gap-4 rounded-xl transition transform hover:scale-[1.02] ${
              isActive
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                : theme === 'light'
                  ? 'bg-white shadow hover:bg-slate-50'
                  : 'bg-slate-800 shadow hover:bg-slate-700'
            }`}
          >
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg shadow transition-colors ${
                isActive
                  ? theme === 'light'
                    ? 'bg-gray-100 text-teal-600'
                    : 'bg-slate-700 text-teal-400'
                  : theme === 'light'
                    ? 'bg-gray-100 text-teal-600 group-hover:bg-teal-100'
                    : 'bg-slate-700 text-teal-400 group-hover:bg-teal-600/20'
              }`}
            >
              {juz.number}
            </div>
            <div>
              <p
                className={`font-semibold ${
                  isActive
                    ? 'text-white'
                    : theme === 'light'
                      ? 'text-slate-700'
                      : 'text-[var(--foreground)]'
                }`}
              >
                Juz {juz.number}
              </p>
              <p
                className={`text-xs ${
                  isActive
                    ? 'text-white/90'
                    : theme === 'light'
                      ? 'text-slate-600'
                      : 'text-slate-400'
                }`}
              >
                {juz.surahRange}
              </p>
            </div>
          </Link>
        </li>
      );
    })}
  </ul>
);

export default Juz;
