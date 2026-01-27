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

  const selectedTranslationName = useMemo(() => {
    if (settings.translationIds?.length === 0) {
      return t('no_translation_selected');
    }

    return (
      translationOptions.find((o) => o.id === settings.translationId)?.name ||
      t('select_translation')
    );
  }, [settings.translationIds, settings.translationId, translationOptions, t]);

  return { translationOptions, selectedTranslationName };
};
