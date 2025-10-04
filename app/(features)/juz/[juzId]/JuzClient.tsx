'use client';

import React from 'react';

import { ReaderShell } from '@/app/shared/reader';
import { getVersesByJuz } from '@/lib/api';
import { ensureLanguageCode } from '@/lib/text/languageCodes';

interface JuzClientProps {
  juzId: string;
}

export function JuzClient({ juzId }: JuzClientProps): React.JSX.Element {
  return (
    <ReaderShell
      resourceId={juzId}
      lookup={({ id, translationIds, page, perPage, wordLang }) =>
        getVersesByJuz({ id, translationIds, page, perPage, wordLang: ensureLanguageCode(wordLang) })
      }
      emptyLabelKey="no_verses_found_in_juz"
      endLabelKey="end_of_juz"
    />
  );
}
