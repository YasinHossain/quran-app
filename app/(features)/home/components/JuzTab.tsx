'use client';

import { memo } from 'react';

import { useNavigationDatasets } from '@/app/shared/navigation/hooks/useNavigationDatasets';
import { buildJuzRoute } from '@/app/shared/navigation/routes';
import { JuzNavigationCard } from '@/app/shared/ui/cards/StandardNavigationCard';

import { NavigationCardGrid } from './NavigationCardGrid';

export const JuzTab = memo(function JuzTab(): React.JSX.Element {
  const { juzs } = useNavigationDatasets();

  return (
    <NavigationCardGrid>
      {juzs.map((juz) => (
        <JuzNavigationCard
          key={juz.number}
          href={buildJuzRoute(juz.number)}
          scroll
          className="items-center"
          content={{
            id: juz.number,
            title: `Juz ${juz.number}`,
            subtitle: juz.surahRange,
          }}
        />
      ))}
    </NavigationCardGrid>
  );
});
