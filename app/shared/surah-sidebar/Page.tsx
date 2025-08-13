import Link from 'next/link';
import type { Chapter } from '@/types';
import { getJuzByPage, getSurahByPage } from '@/lib/utils/surah-navigation';

interface Props {
  pages: number[];
  chapters: Chapter[];
  theme: string;
  selectedPageId: string | null;
  setSelectedPageId: (id: string) => void;
  setSelectedJuzId: (id: string) => void;
  setSelectedSurahId: (id: string) => void;
  rememberScroll: () => void;
}

const Page = ({
  pages,
  chapters,
  theme,
  selectedPageId,
  setSelectedPageId,
  setSelectedJuzId,
  setSelectedSurahId,
  rememberScroll,
}: Props) => (
  <ul className="space-y-2">
    {pages.map((p) => {
      const isActive = String(p) === selectedPageId;
      return (
        <li key={p}>
          <Link
            href={`/page/${p}`}
            scroll={false}
            data-active={isActive}
            onClick={() => {
              setSelectedPageId(String(p));
              setSelectedJuzId(String(getJuzByPage(p)));
              const chap = getSurahByPage(p, chapters);
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
                  ? 'bg-white/20 text-white'
                  : theme === 'light'
                    ? 'bg-gray-100 text-teal-600 group-hover:bg-teal-100'
                    : 'bg-slate-700 text-teal-400 group-hover:bg-teal-600/20'
              }`}
            >
              {p}
            </div>
            <p
              className={`font-semibold ${
                isActive
                  ? 'text-white'
                  : theme === 'light'
                    ? 'text-slate-700'
                    : 'text-[var(--foreground)]'
              }`}
            >
              Page {p}
            </p>
          </Link>
        </li>
      );
    })}
  </ul>
);

export default Page;
