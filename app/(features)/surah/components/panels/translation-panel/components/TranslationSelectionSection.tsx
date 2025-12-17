'use client';

import React from 'react';

import { TranslationSearch } from '@/app/(features)/surah/components/panels/translation-panel/TranslationSearch';
import { TranslationSelectionList } from '@/app/(features)/surah/components/panels/translation-panel/TranslationSelectionList';

import type { TranslationResource } from '@/types';

interface TranslationSelectionSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  orderedSelection: number[];
  translations: TranslationResource[];
  handleSelection: (id: number) => void;
  onReorder: (ids: number[]) => void;
}

export function TranslationSelectionSection(
  props: TranslationSelectionSectionProps
): React.JSX.Element {
  return (
    <div className="p-4 space-y-4">
      <TranslationSearch searchTerm={props.searchTerm} setSearchTerm={props.setSearchTerm} />
      <TranslationSelectionList
        orderedSelection={props.orderedSelection}
        translations={props.translations}
        handleSelectionToggle={props.handleSelection}
        onReorder={props.onReorder}
      />
    </div>
  );
}
