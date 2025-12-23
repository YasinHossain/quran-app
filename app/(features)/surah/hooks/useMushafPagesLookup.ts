'use client';

import { useMemo } from 'react';
import useSWRImmutable from 'swr/immutable';

import { getMushafPagesLookup } from '@infra/quran/pagesLookupClient';

import type { PagesLookupResult } from '@infra/quran/pagesLookupClient';
import type { MushafResourceKind } from './mushafReadingViewTypes';

type UseMushafPagesLookupParams = {
  resourceId: string;
  resourceKind: MushafResourceKind;
  mushafId: string;
};

export type UseMushafPagesLookupResult = {
  data: PagesLookupResult | null;
  isLoading: boolean;
  error: string | null;
};

export function useMushafPagesLookup({
  resourceId,
  resourceKind,
  mushafId,
}: UseMushafPagesLookupParams): UseMushafPagesLookupResult {
  const numericResourceId = useMemo(() => Number.parseInt(resourceId, 10), [resourceId]);
  const isEnabled = Number.isFinite(numericResourceId) && numericResourceId > 0;

  const requestKey = isEnabled ? ['pages-lookup', resourceKind, resourceId, mushafId] : null;

  const { data, error, isLoading } = useSWRImmutable<PagesLookupResult>(
    requestKey,
    async () => {
      if (!Number.isFinite(numericResourceId) || numericResourceId <= 0) {
        throw new Error('Invalid resource identifier for pages lookup.');
      }

      return getMushafPagesLookup({
        resourceKind,
        resourceId: numericResourceId,
        mushafId,
      });
    }
  );

  return {
    data: data ?? null,
    isLoading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
  };
}

