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
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  handleDragEnd: () => void;
  draggedId: number | null;
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
        handleDragStart={props.handleDragStart}
        handleDragOver={props.handleDragOver}
        handleDrop={props.handleDrop}
        handleDragEnd={props.handleDragEnd}
        draggedId={props.draggedId}
      />
    </div>
  );
}
