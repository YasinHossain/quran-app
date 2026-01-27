import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';

import { useSettings } from '@/app/providers/SettingsContext';
import { getTranslations } from '@/lib/api';
import { TranslationResource } from '@/types';

interface UseTranslationOptionsReturn {
  translationOptions: TranslationResource[];
  selectedTranslationName: string;
}

export const useTranslationOptions = (): UseTranslationOptionsReturn => {
  const { t } = useTranslation();
  const { settings } = useSettings();

  const { data } = useSWR('translations', getTranslations);
  const translationOptions: TranslationResource[] = useMemo(() => data || [], [data]);

  const selectedTranslationName = useMemo(
    () =>
      translationOptions.find((o) => o.id === settings.translationId)?.name ||
      t('select_translation'),
    [translationOptions, settings.translationId, t]
  );

  return { translationOptions, selectedTranslationName };
};
