'use client';

import React from 'react';

import { ReaderShell } from '@/app/shared/reader';
import { getVersesByJuz } from '@/lib/api';
import { ensureLanguageCode } from '@/lib/text/languageCodes';

type ReaderShellProps = React.ComponentProps<typeof ReaderShell>;

interface JuzClientProps extends Pick<
  ReaderShellProps,
  'initialVerses' | 'initialVersesParams' | 'totalVerses'
> {
  juzId: string;
}

export function JuzClient({
  juzId,
  initialVerses,
  initialVersesParams,
  totalVerses,
}: JuzClientProps): React.JSX.Element {
  return (
    <ReaderShell
      resourceId={juzId}
      resourceKind="juz"
      {...(initialVerses ? { initialVerses } : {})}
      {...(initialVersesParams ? { initialVersesParams } : {})}
      {...(typeof totalVerses === 'number' ? { totalVerses } : {})}
      lookup={({ id, translationIds, page, perPage, wordLang }) =>
        getVersesByJuz({
          id,
          translationIds,
          page,
          perPage,
          wordLang: ensureLanguageCode(wordLang),
        })
      }
      emptyLabelKey="no_verses_found_in_juz"
      endLabelKey="end_of_juz"
    />
  );
}
