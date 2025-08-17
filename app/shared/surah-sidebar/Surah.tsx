import Link from 'next/link';
import type { Chapter } from '@/types';
import { getJuzByPage } from '@/lib/utils/surah-navigation';

interface Props {
  chapters: Chapter[];
  theme: string;
  selectedSurahId: string | null;
  setSelectedSurahId: (id: string) => void;
  setSelectedPageId: (id: string) => void;
  setSelectedJuzId: (id: string) => void;
  rememberScroll: () => void;
  isTafsirPath: boolean;
}

const Surah = ({
  chapters,
  theme,
  selectedSurahId,
  setSelectedSurahId,
  setSelectedPageId,
  setSelectedJuzId,
  rememberScroll,
  isTafsirPath,
}: Props) => (
  <ul className="space-y-2">
    {chapters.map((chapter) => {
      const isActive = String(chapter.id) === selectedSurahId;
      return (
        <li key={chapter.id}>
          <Link
            href={isTafsirPath ? `/tafsir/${chapter.id}/1` : `/surah/${chapter.id}`}
            scroll={false}
            data-active={isActive}
            onClick={() => {
              setSelectedSurahId(String(chapter.id));
              const firstPage = chapter.pages?.[0] ?? 1;
              setSelectedPageId(String(firstPage));
              setSelectedJuzId(String(getJuzByPage(firstPage)));
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
              {chapter.id}
            </div>
            <div className="flex-grow">
              <p
                className={`font-bold ${
                  isActive
                    ? 'text-white'
                    : theme === 'light'
                      ? 'text-slate-700'
                      : 'text-[var(--foreground)]'
                }`}
              >
                {chapter.name_simple}
              </p>
              <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                {chapter.revelation_place} • {chapter.verses_count} verses
              </p>
            </div>
            <p
              className={`font-amiri text-xl font-bold transition-colors ${
                isActive
                  ? 'text-white'
                  : theme === 'light'
                    ? 'text-gray-500 group-hover:text-teal-600'
                    : 'text-gray-500 group-hover:text-teal-400'
              }`}
            >
              {chapter.name_arabic}
            </p>
          </Link>
        </li>
      );
    })}
  </ul>
);

export default Surah;
