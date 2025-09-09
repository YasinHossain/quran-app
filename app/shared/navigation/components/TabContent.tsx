import { memo } from 'react';

import { NavigationItem } from './NavigationItem';

import type { JuzSummary } from '@/app/shared/navigation/hooks/useQuranNavigation';
import type { Surah } from '@/types';

interface TabContentProps {
  activeTab: 'surah' | 'juz' | 'page';
  filteredSurahs: Surah[];
  filteredJuzs: JuzSummary[];
  filteredPages: number[];
  onSurahClick: (surahId: number) => void;
  onJuzClick: (juzNumber: number) => void;
  onPageClick: (page: number) => void;
}

export const TabContent = memo(function TabContent({
  activeTab,
  filteredSurahs,
  filteredJuzs,
  filteredPages,
  onSurahClick,
  onJuzClick,
  onPageClick,
}: TabContentProps): React.JSX.Element {
  if (activeTab === 'surah') {
    return <SurahList filteredSurahs={filteredSurahs} onSurahClick={onSurahClick} />;
  }

  if (activeTab === 'juz') {
    return <JuzList filteredJuzs={filteredJuzs} onJuzClick={onJuzClick} />;
  }

  return <PageList filteredPages={filteredPages} onPageClick={onPageClick} />;
});

function SurahList({
  filteredSurahs,
  onSurahClick,
}: {
  filteredSurahs: Surah[];
  onSurahClick: (surahId: number) => void;
}): React.JSX.Element {
  return (
    <div className="p-4">
      <div className="grid gap-2">
        {filteredSurahs.map((surah) => (
          <NavigationItem
            key={surah.number}
            number={surah.number}
            title={surah.name}
            subtitle={`${surah.verses} verses`}
            arabicName={surah.arabicName}
            onClick={() => onSurahClick(surah.number)}
          />
        ))}
      </div>
    </div>
  );
}

function JuzList({
  filteredJuzs,
  onJuzClick,
}: {
  filteredJuzs: JuzSummary[];
  onJuzClick: (juzNumber: number) => void;
}): React.JSX.Element {
  return (
    <div className="p-4">
      <div className="grid gap-2">
        {filteredJuzs.map((juz) => (
          <NavigationItem
            key={juz.number}
            number={juz.number}
            title={`Juz ${juz.number}`}
            subtitle={juz.surahRange}
            onClick={() => onJuzClick(juz.number)}
          />
        ))}
      </div>
    </div>
  );
}

function PageList({
  filteredPages,
  onPageClick,
}: {
  filteredPages: number[];
  onPageClick: (page: number) => void;
}): React.JSX.Element {
  return (
    <div className="p-4">
      <div className="grid gap-2">
        {filteredPages.map((page) => (
          <NavigationItem
            key={page}
            number={page}
            title={`Page ${page}`}
            onClick={() => onPageClick(page)}
          />
        ))}
      </div>
    </div>
  );
}
