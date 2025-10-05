'use client';

import React from 'react';

import { TranslationResource } from '@/types';

import { MAX_TRANSLATION_SELECTIONS } from './hooks/useTranslationSelection';
import { SelectedTranslationItem } from './SelectedTranslationItem';

interface TranslationSelectionListProps {
  orderedSelection: number[];
  translations: TranslationResource[];
  handleSelectionToggle: (id: number) => void;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  handleDragEnd: () => void;
  draggedId: number | null;
}

export const TranslationSelectionList = ({
  orderedSelection,
  translations,
  handleSelectionToggle,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
  draggedId,
}: TranslationSelectionListProps): React.JSX.Element => (
  <div>
    <h2 className="text-sm font-semibold px-2 mb-3 flex items-center justify-between text-foreground">
      <span>
        MY SELECTIONS ({orderedSelection.length}/{MAX_TRANSLATION_SELECTIONS})
      </span>
      {orderedSelection.length >= MAX_TRANSLATION_SELECTIONS && (
        <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-medium">
          MAX
        </span>
      )}
    </h2>
    <div className="space-y-2 min-h-[60px] rounded-lg p-3 bg-surface border border-border">
      {orderedSelection.length === 0 ? (
        <p className="text-center text-sm py-4 text-muted font-medium">No translations selected</p>
      ) : (
        orderedSelection.map((id) => {
          const item = translations.find((t) => t.id === id);
          if (!item) return null;
          return (
            <SelectedTranslationItem
              key={id}
              item={item}
              isDragging={draggedId === id}
              onRemove={handleSelectionToggle}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
            />
          );
        })
      )}
    </div>
  </div>
);
