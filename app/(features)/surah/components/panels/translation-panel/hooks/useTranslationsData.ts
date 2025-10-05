'use client';

import { useState, useEffect, useCallback } from 'react';

import { initialTranslationsData } from '@/app/(features)/surah/components/panels/translation-panel/translationPanel.data';
import { capitalizeLanguageName } from '@/app/(features)/surah/components/panels/translation-panel/translationPanel.utils';
import { getTranslations } from '@/lib/api/translations';
import { logger } from '@/src/infrastructure/monitoring/Logger';
import { TranslationResource } from '@/types';

export const useTranslationsData = (): {
  translations: TranslationResource[];
  loading: boolean;
  error: string | null;
  languageSort: (a: string, b: string) => number;
} => {
  const [translations, setTranslations] = useState<TranslationResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTranslationsAsync = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const apiTranslations = await getTranslations();
        const formatted = apiTranslations.map((t) => ({
          ...t,
          lang: capitalizeLanguageName(t.lang),
        }));
        setTranslations(formatted);
      } catch (err) {
        logger.error('Failed to fetch translations from API:', undefined, err as Error);
        setError('Failed to load translations from API. Using offline data.');
        setTranslations(initialTranslationsData);
      } finally {
        setLoading(false);
      }
    };

    if (translations.length === 0) {
      loadTranslationsAsync();
    }
  }, [translations.length]);

  const languageSort = useCallback((a: string, b: string) => {
    if (a === 'English') return -1;
    if (b === 'English') return 1;
    if (a === 'Bengali') return -1;
    if (b === 'Bengali') return 1;
    return a.localeCompare(b);
  }, []);

  return { translations, loading, error, languageSort } as const;
};
