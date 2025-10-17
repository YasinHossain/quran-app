'use client';

import { useCallback, useMemo } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import { useSettings } from '@/app/providers/SettingsContext';
import { getVerseById, getVerseByKey } from '@/lib/api/verses';
import { ensureLanguageCode } from '@/lib/text/languageCodes';

import type { LanguageCode } from '@/lib/text/languageCodes';
import type { Verse } from '@/types';

export interface UseSingleVerseOptions {
  idOrKey: string;
  suspense?: boolean;
}

export interface UseSingleVerseReturn {
  verse: Verse | undefined;
  isLoading: boolean;
  error: string | null;
  mutate: () => void;
}

const FALLBACK_TRANSLATION_ID = 20;
const COMPOSITE_VERSE_ID_PATTERN = /:|[^0-9]/;

function fetchSingleVerse(
  target: string,
  translationIds: number[],
  wordLang: LanguageCode
): Promise<Verse> {
  const normalizedTarget = target.trim();
  if (!normalizedTarget) {
    return Promise.reject(new Error('Verse identifier is required'));
  }
  if (COMPOSITE_VERSE_ID_PATTERN.test(normalizedTarget)) {
    return getVerseByKey(normalizedTarget, translationIds, wordLang);
  }
  return getVerseById(normalizedTarget, translationIds, wordLang);
}

function resolveTranslationIds(translationIds: number[], fallbackTranslationId: number): number[] {
  const validIds = translationIds.filter((id) => Number.isFinite(id));
  if (validIds.length > 0) {
    return validIds;
  }
  return [Number.isFinite(fallbackTranslationId) ? fallbackTranslationId : FALLBACK_TRANSLATION_ID];
}

function createSWRKey(
  idOrKey: string,
  translationIdsKey: string,
  wordLang: LanguageCode
): [string, string, string, LanguageCode] | null {
  const normalizedId = idOrKey.trim();
  if (!normalizedId) {
    return null;
  }
  return ['single-verse', normalizedId, translationIdsKey, wordLang];
}

export function usePrefetchSingleVerse(): (
  targets: Array<string | null | undefined>
) => Promise<void> {
  const { mutate } = useSWRConfig();
  const { settings } = useSettings();

  const translationIds = useMemo(
    () => resolveTranslationIds(settings.translationIds, settings.translationId),
    [settings.translationIds, settings.translationId]
  );
  const translationIdsKey = useMemo(() => translationIds.join(','), [translationIds]);
  const wordLang = useMemo<LanguageCode>(
    () => ensureLanguageCode(settings.wordLang),
    [settings.wordLang]
  );

  return useCallback(
    async (targets: Array<string | null | undefined>) => {
      const normalizedTargets = targets
        .map((target) => target?.trim())
        .filter((value): value is string => Boolean(value));

      if (normalizedTargets.length === 0) return;

      await Promise.all(
        normalizedTargets.map(async (target) => {
          const key = createSWRKey(target, translationIdsKey, wordLang);
          if (!key) return;
          await mutate(key, () => fetchSingleVerse(target, translationIds, wordLang), {
            populateCache: true,
            revalidate: false,
          }).catch(() => {});
        })
      );
    },
    [mutate, translationIdsKey, translationIds, wordLang]
  );
}

export function useSingleVerse({
  idOrKey,
  suspense = false,
}: UseSingleVerseOptions): UseSingleVerseReturn {
  const { settings } = useSettings();

  const translationIds = useMemo(
    () => resolveTranslationIds(settings.translationIds, settings.translationId),
    [settings.translationIds, settings.translationId]
  );
  const translationIdsKey = useMemo(() => translationIds.join(','), [translationIds]);
  const wordLang = useMemo<LanguageCode>(
    () => ensureLanguageCode(settings.wordLang),
    [settings.wordLang]
  );

  const swrKey = useMemo(
    () => createSWRKey(idOrKey, translationIdsKey, wordLang),
    [idOrKey, translationIdsKey, wordLang]
  );

  const fetchVerse = useCallback(async (): Promise<Verse> => {
    const target = idOrKey.trim();
    if (!target) {
      throw new Error('Verse identifier is required');
    }
    return fetchSingleVerse(target, translationIds, wordLang);
  }, [idOrKey, translationIds, wordLang]);

  const { data, error, isLoading, mutate } = useSWR<Verse>(swrKey, fetchVerse, {
    suspense,
  });

  const normalizedError = error
    ? error instanceof Error
      ? error.message
      : 'Failed to load verse'
    : null;

  const revalidate = useCallback(() => {
    void mutate();
  }, [mutate]);

  return {
    verse: data,
    isLoading: Boolean(isLoading),
    error: normalizedError,
    mutate: revalidate,
  };
}
