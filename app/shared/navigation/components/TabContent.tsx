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

  if (activeTab === 'juz') {
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
});
