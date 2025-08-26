import type { Chapter } from '@/types';
import { getJuzByPage, getSurahByPage } from '@/lib/utils/surah-navigation';
import { SidebarCard } from '@/app/shared/ui/SidebarCard';
import { NumberBadge } from '@/app/shared/ui/NumberBadge';

interface Props {
  pages: number[];
  chapters: Chapter[];
  selectedPageId: string | null;
  setSelectedPageId: (id: string) => void;
  setSelectedJuzId: (id: string) => void;
  setSelectedSurahId: (id: string) => void;
  rememberScroll: () => void;
}

const Page = ({
  pages,
  chapters,
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
          <SidebarCard
            href={`/page/${p}`}
            scroll={false}
            data-active={isActive}
            isActive={isActive}
            className="items-center ml-2"
            onClick={() => {
              setSelectedPageId(String(p));
              setSelectedJuzId(String(getJuzByPage(p)));
              const chap = getSurahByPage(p, chapters);
              if (chap) setSelectedSurahId(String(chap.id));
              rememberScroll();
            }}
          >
            <NumberBadge number={p} isActive={isActive} />
            <p
              className={`font-semibold leading-tight mb-0 ${
                isActive ? 'text-on-accent' : 'text-foreground'
              }`}
            >
              Page {p}
            </p>
          </SidebarCard>
        </li>
      );
    })}
  </ul>
);

export default Page;
