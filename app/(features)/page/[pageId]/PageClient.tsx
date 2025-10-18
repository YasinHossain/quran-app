'use client';

import React from 'react';

import { ReaderShell } from '@/app/shared/reader';
import { getVersesByPage } from '@/lib/api';
import { ensureLanguageCode } from '@/lib/text/languageCodes';

interface PageClientProps {
  pageId: string;
}

export function PageClient({ pageId }: PageClientProps): React.JSX.Element {
  return (
    <ReaderShell
      resourceId={pageId}
      lookup={({ id, translationIds, page, perPage, wordLang }) =>
        getVersesByPage({
          id,
          translationIds,
          page,
          perPage,
          wordLang: ensureLanguageCode(wordLang),
        })
      }
      emptyLabelKey="no_verses_found_on_page"
      endLabelKey="end_of_page"
    />
  );
}
