import { useCallback, useEffect, type MutableRefObject } from 'react';

import type { LookupFn } from './useVerseListing';
import type { Key, MutatorCallback, MutatorOptions } from 'swr';

export const VERSES_PER_PAGE = 20;

export type SetSize = (size: number | ((size: number) => number)) => Promise<unknown>;
type Mutate = <Data = unknown>(
  key: Key,
  data?: Data | Promise<Data> | MutatorCallback<Data>,
  opts?: MutatorOptions<Data>
) => Promise<Data | undefined>;

export const buildSWRKeyFactory = (
  id?: string,
  stableTranslationIds?: string,
  wordLang?: string
) => {
  return (index: number) => (id ? ['verses', id, stableTranslationIds, wordLang, index + 1] : null);
};

export const createFetcher = (lookup: LookupFn, setError: (msg: string) => void) => {
  return ([, pId, translationIdsStr, wl, page]: [string, string, string, string, number]) => {
    const translationIds = translationIdsStr.split(',').map(Number);
    return lookup({
      id: pId as string,
      translationIds,
      page: page as number,
      perPage: VERSES_PER_PAGE,
      wordLang: wl as string,
    }).catch((err) => {
      setError(`Failed to load content. ${err.message}`);
      return { verses: [], totalPages: 1 };
    });
  };
};

export const useTargetVersePreload = (
  targetVerseNumber: number | undefined,
  size: number,
  setSize: SetSize,
  surahId?: string
): void => {
  useEffect(() => {
    if (!targetVerseNumber || targetVerseNumber <= 0) return;
    const requiredPages = Math.max(1, Math.ceil(targetVerseNumber / VERSES_PER_PAGE));
    if (requiredPages > size) {
      setSize(requiredPages);
    }
  }, [targetVerseNumber, size, setSize, surahId]);
};

interface PrefetchNextPageParams {
  id?: string | undefined;
  keyFactory: (index: number) => Key;
  isReachingEnd: boolean;
  mutateGlobal: Mutate;
  lookup: LookupFn;
  size: number;
  prefetchedPagesRef: MutableRefObject<Set<number>>;
}

interface ParsedNextKey {
  chapterId: string;
  translationIds: number[];
  wordLang: string;
  page: number;
  key: Key;
}

const parseNextKey = (nextKey: Key): ParsedNextKey | null => {
  if (!nextKey || !Array.isArray(nextKey)) return null;

  const [, chapterId, translationIdsValue, wordLang, page] = nextKey;
  if (
    typeof chapterId !== 'string' ||
    typeof translationIdsValue !== 'string' ||
    typeof wordLang !== 'string' ||
    typeof page !== 'number'
  ) {
    return null;
  }

  const translationIds = translationIdsValue
    .split(',')
    .filter((value) => value.length > 0)
    .map((value) => Number(value));

  return {
    chapterId,
    translationIds,
    wordLang,
    page,
    key: nextKey,
  };
};

export const usePrefetchNextPage = ({
  id,
  keyFactory,
  isReachingEnd,
  mutateGlobal,
  lookup,
  size,
  prefetchedPagesRef,
}: PrefetchNextPageParams): (() => void) => {
  return useCallback(() => {
    if (!id || !keyFactory || isReachingEnd) return;

    const nextPageIndex = size;
    if (prefetchedPagesRef.current.has(nextPageIndex)) return;

    const parsedKey = parseNextKey(keyFactory(nextPageIndex));
    if (!parsedKey) return;

    const { chapterId, translationIds, wordLang, page, key } = parsedKey;

    prefetchedPagesRef.current.add(nextPageIndex);

    void mutateGlobal(
      key,
      () =>
        lookup({
          id: chapterId,
          translationIds,
          page,
          perPage: VERSES_PER_PAGE,
          wordLang,
        }).catch((err) => {
          prefetchedPagesRef.current.delete(nextPageIndex);
          throw err;
        }),
      { populateCache: true, revalidate: false }
    ).catch(() => {});
  }, [id, keyFactory, isReachingEnd, mutateGlobal, lookup, size, prefetchedPagesRef]);
};
