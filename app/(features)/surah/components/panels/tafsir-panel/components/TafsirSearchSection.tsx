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
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  handleDragEnd: () => void;
  draggedId: number | null;
}

export const TafsirSearchSection = ({
  searchTerm,
  setSearchTerm,
  orderedSelection,
  tafsirs,
  handleSelectionToggle,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
  draggedId,
}: TafsirSearchSectionProps): React.JSX.Element => (
  <div className="p-4 space-y-4">
    <TafsirSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    <TafsirSelectionList
      orderedSelection={orderedSelection}
      tafsirs={tafsirs}
      handleSelectionToggle={handleSelectionToggle}
      handleDragStart={handleDragStart}
      handleDragOver={handleDragOver}
      handleDrop={handleDrop}
      handleDragEnd={handleDragEnd}
      draggedId={draggedId}
    />
  </div>
);
