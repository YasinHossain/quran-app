import { useMemo } from 'react';
import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/presentation/providers/SettingsContext';
import { getTranslations } from '@/lib/api';
import { TranslationResource } from '@/types';

export const useTranslationOptions = () => {
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
