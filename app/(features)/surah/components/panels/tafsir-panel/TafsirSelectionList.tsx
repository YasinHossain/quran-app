'use client';

import React from 'react';

import { ReorderableSelectionList } from '@/app/shared/resource-panel/components/ReorderableSelectionList';

import { MAX_TAFSIR_SELECTIONS } from './tafsirPanel.utils';

import type { TafsirResource } from '@/types';

interface TafsirSelectionListProps {
  orderedSelection: number[];
  tafsirs: TafsirResource[];
  handleSelectionToggle: (id: number) => void;
  onReorder?: (ids: number[]) => void;
}

export const TafsirSelectionList = ({
  orderedSelection,
  tafsirs,
  handleSelectionToggle,
  onReorder,
}: TafsirSelectionListProps): React.JSX.Element => {
  return (
    <ReorderableSelectionList
      variant="tafsir"
      orderedSelection={orderedSelection}
      resources={tafsirs}
      onRemove={handleSelectionToggle}
      {...(onReorder ? { onReorder } : {})}
      maxSelections={MAX_TAFSIR_SELECTIONS}
      emptyText="No tafsirs selected"
    />
  );
};
