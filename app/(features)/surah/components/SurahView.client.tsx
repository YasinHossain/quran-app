'use client';

import React from 'react';

import { ReaderShell } from '@/app/shared/reader';
import { getVersesByChapter } from '@/lib/api';
import { ensureLanguageCode } from '@/lib/text/languageCodes';

interface SurahViewProps {
  surahId: string;
  initialVerseNumber?: number | undefined;
}

/**
 * Main client component for displaying Surah verses with settings sidebar.
 * Manages verse listing, audio playback, and responsive layout with hidden header behavior.
 */
export function SurahView({ surahId, initialVerseNumber }: SurahViewProps): React.JSX.Element {
  const initialVerseKey =
    typeof initialVerseNumber === 'number' && initialVerseNumber > 0
      ? `${surahId}:${initialVerseNumber}`
      : undefined;

  return (
    <ReaderShell
      resourceId={surahId}
      lookup={({ id, translationIds, page, perPage, wordLang }) =>
        getVersesByChapter({
          id,
          translationIds,
          page,
          perPage,
          wordLang: ensureLanguageCode(wordLang),
        })
      }
      emptyLabelKey="no_verses_found"
      endLabelKey="end_of_surah"
      {...(typeof initialVerseNumber === 'number' ? { initialVerseNumber } : {})}
      {...(typeof initialVerseKey === 'string' ? { initialVerseKey } : {})}
    />
  );
}
