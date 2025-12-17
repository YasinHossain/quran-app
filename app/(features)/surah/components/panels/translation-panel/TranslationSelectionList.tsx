'use client';

import React from 'react';

import { ReorderableSelectionList } from '@/app/shared/resource-panel/components/ReorderableSelectionList';

import { MAX_TRANSLATION_SELECTIONS } from './hooks/useTranslationSelection';

import type { TranslationResource } from '@/types';

interface TranslationSelectionListProps {
  orderedSelection: number[];
  translations: TranslationResource[];
  handleSelectionToggle: (id: number) => void;
  onReorder?: (ids: number[]) => void;
}

export const TranslationSelectionList = ({
  orderedSelection,
  translations,
  handleSelectionToggle,
  onReorder,
}: TranslationSelectionListProps): React.JSX.Element => {
  return (
    <ReorderableSelectionList
      variant="translation"
      orderedSelection={orderedSelection}
      resources={translations}
      onRemove={handleSelectionToggle}
      {...(onReorder ? { onReorder } : {})}
      maxSelections={MAX_TRANSLATION_SELECTIONS}
      emptyText="No translations selected"
      removeAriaLabel="Remove translation"
    />
  );
};
