'use client';

import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { formatJuzRange } from '@/app/shared/navigation/formatJuzRange';
import { useNavigationDatasets } from '@/app/shared/navigation/hooks/useNavigationDatasets';
import { buildJuzRoute } from '@/app/shared/navigation/routes';
import { JuzNavigationCard } from '@/app/shared/ui/cards/StandardNavigationCard';

import { NavigationCardGrid } from './NavigationCardGrid';

export const JuzTab = memo(function JuzTab(): React.JSX.Element {
  const { t, i18n } = useTranslation();
  const language = i18n?.language ?? 'en';
  const { juzs } = useNavigationDatasets();

  return (
    <NavigationCardGrid>
      {juzs.map((juz) => (
        <JuzNavigationCard
          key={juz.number}
          href={buildJuzRoute(juz.number)}
          scroll
          prefetch={true}
          className="items-center"
          content={{
            id: juz.number,
            title: t('juz_number', { number: juz.number, defaultValue: `Juz ${juz.number}` }),
            subtitle: formatJuzRange(juz, t, language),
          }}
        />
      ))}
    </NavigationCardGrid>
  );
});
