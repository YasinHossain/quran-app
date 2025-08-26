import type { Chapter } from '@/types';
import { getSurahByPage, JUZ_START_PAGES } from '@/lib/utils/surah-navigation';
import { SidebarCard } from '@/app/shared/ui/SidebarCard';
import { NumberBadge } from '@/app/shared/ui/NumberBadge';

interface JuzSummary {
  number: number;
  name: string;
  surahRange: string;
}

interface Props {
  juzs: JuzSummary[];
  chapters: Chapter[];
  selectedJuzId: string | null;
  setSelectedJuzId: (id: string) => void;
  setSelectedPageId: (id: string) => void;
  setSelectedSurahId: (id: string) => void;
  rememberScroll: () => void;
}

const Juz = ({
  juzs,
  chapters,
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
          <SidebarCard
            href={`/juz/${juz.number}`}
            scroll={false}
            data-active={isActive}
            isActive={isActive}
            className="items-center ml-2"
            onClick={() => {
              setSelectedJuzId(String(juz.number));
              const page = JUZ_START_PAGES[juz.number - 1];
              setSelectedPageId(String(page));
              const chap = getSurahByPage(page, chapters);
              if (chap) setSelectedSurahId(String(chap.id));
              rememberScroll();
            }}
          >
            <NumberBadge number={juz.number} isActive={isActive} />
            <div>
              <p
                className={`font-semibold leading-tight mb-0 ${
                  isActive ? 'text-on-accent' : 'text-foreground'
                }`}
              >
                Juz {juz.number}
              </p>
              <p
                className={`text-xs leading-tight mt-2 mb-0 ${
                  isActive ? 'text-on-accent/90' : 'text-muted'
                }`}
              >
                {juz.surahRange}
              </p>
            </div>
          </SidebarCard>
        </li>
      );
    })}
  </ul>
);

export default Juz;
