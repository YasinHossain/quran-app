import { useCallback, useEffect, type MutableRefObject } from 'react';

import type { LookupFn } from './useVerseListing';
import type { Key, MutatorCallback, MutatorOptions } from 'swr';
import type { MushafResourceKind } from './mushafReadingViewTypes';

export const VERSES_PER_PAGE = 10;

export type SetSize = (size: number | ((size: number) => number)) => Promise<unknown>;
type Mutate = <Data = unknown>(
  key: Key,
  data?: Data | Promise<Data> | MutatorCallback<Data>,
  opts?: MutatorOptions<Data>
) => Promise<Data | undefined>;

export const buildSWRKeyFactory = (
  resourceKind?: MushafResourceKind,
  id?: string,
  stableTranslationIds?: string,
  wordLang?: string,
  tajweed?: boolean
) => {
  return (index: number) =>
    id
      ? ['verses', resourceKind ?? 'surah', id, stableTranslationIds, wordLang, index + 1, tajweed]
      : null;
};

export const createFetcher = (lookup: LookupFn, setError: (msg: string) => void) => {
  return ([, _resourceKind, pId, translationIdsStr, wl, page, tajweed]: [
    string,
    string, // resourceKind
    string, // id
    string,
    string,
    number,
    boolean | undefined,
  ]) => {
    // Resource kind is intentionally ignored here: the lookup function determines the API endpoint.
    const translationIds = translationIdsStr.split(',').map(Number);
    return lookup({
      id: pId as string,
      translationIds,
      page: page as number,
      perPage: VERSES_PER_PAGE,
      wordLang: wl as string,
      tajweed: !!tajweed,
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
  resourceKind: MushafResourceKind;
  resourceId: string;
  translationIds: number[];
  wordLang: string;
  page: number;
  tajweed: boolean;
  key: Key;
}

const parseNextKey = (nextKey: Key): ParsedNextKey | null => {
  if (!nextKey || !Array.isArray(nextKey)) return null;

  const [, resourceKind, resourceId, translationIdsValue, wordLang, page, tajweed] = nextKey;
  if (
    (resourceKind !== 'surah' && resourceKind !== 'juz' && resourceKind !== 'page') ||
    typeof resourceId !== 'string' ||
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
    resourceKind,
    resourceId,
    translationIds,
    wordLang,
    page,
    tajweed: !!tajweed,
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

    const { resourceId, translationIds, wordLang, page, tajweed, key } = parsedKey;

    prefetchedPagesRef.current.add(nextPageIndex);

    void mutateGlobal(
      key,
      () =>
        lookup({
          id: resourceId,
          translationIds,
          page,
          perPage: VERSES_PER_PAGE,
          wordLang,
          tajweed,
        }).catch((err) => {
          prefetchedPagesRef.current.delete(nextPageIndex);
          throw err;
        }),
      { populateCache: true, revalidate: false }
    ).catch(() => {});
  }, [id, keyFactory, isReachingEnd, mutateGlobal, lookup, size, prefetchedPagesRef]);
};
