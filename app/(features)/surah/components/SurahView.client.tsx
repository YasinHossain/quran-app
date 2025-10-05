'use client';

import React from 'react';

import { ReaderShell } from '@/app/shared/reader';
import { getVersesByChapter } from '@/lib/api';
import { ensureLanguageCode } from '@/lib/text/languageCodes';

interface SurahViewProps {
  surahId: string;
}

/**
 * Main client component for displaying Surah verses with settings sidebar.
 * Manages verse listing, audio playback, and responsive layout with hidden header behavior.
 */
export function SurahView({ surahId }: SurahViewProps): React.JSX.Element {
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
    />
  );
}
