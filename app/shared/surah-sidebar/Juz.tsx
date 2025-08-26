import type { Chapter } from '@/types';
import { getSurahByPage, JUZ_START_PAGES } from '@/lib/utils/surah-navigation';
import { JuzNavigationCard } from '@/app/shared/ui/cards/StandardNavigationCard';

interface JuzSummary {
  number: number;
  name: string;
  surahRange: string;
}

interface Props {
  juzs: JuzSummary[];
  chapters: Chapter[];
  selectedJuzId: number | null;
  setSelectedJuzId: (id: number) => void;
  setSelectedPageId: (id: number) => void;
  setSelectedSurahId: (id: number) => void;
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
      const isActive = juz.number === selectedJuzId;
      return (
        <li key={juz.number}>
          <JuzNavigationCard
            href={`/juz/${juz.number}`}
            scroll={false}
            data-active={isActive}
            isActive={isActive}
            content={{
              id: juz.number,
              title: `Juz ${juz.number}`,
              subtitle: juz.surahRange,
            }}
            onNavigate={() => {
              setSelectedJuzId(juz.number);
              const page = JUZ_START_PAGES[juz.number - 1];
              setSelectedPageId(page);
              const chap = getSurahByPage(page, chapters);
              if (chap) setSelectedSurahId(chap.id);
              rememberScroll();
            }}
          />
        </li>
      );
    })}
  </ul>
);

export default Juz;
