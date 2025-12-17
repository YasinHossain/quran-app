'use client';

import React from 'react';

import { TafsirSearch } from '@/app/(features)/surah/components/panels/tafsir-panel/TafsirSearch';
import { TafsirSelectionList } from '@/app/(features)/surah/components/panels/tafsir-panel/TafsirSelectionList';
import { TafsirResource } from '@/types';

export interface TafsirSearchSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  orderedSelection: number[];
  tafsirs: TafsirResource[];
  handleSelectionToggle: (id: number) => void;
  onReorder: (ids: number[]) => void;
}

export const TafsirSearchSection = ({
  searchTerm,
  setSearchTerm,
  orderedSelection,
  tafsirs,
  handleSelectionToggle,
  onReorder,
}: TafsirSearchSectionProps): React.JSX.Element => (
  <div className="p-4 space-y-4">
    <TafsirSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    <TafsirSelectionList
      orderedSelection={orderedSelection}
      tafsirs={tafsirs}
      handleSelectionToggle={handleSelectionToggle}
      onReorder={onReorder}
    />
  </div>
);
