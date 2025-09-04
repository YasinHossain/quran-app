'use client';
import type React from 'react';

import { GripVerticalIcon, CloseIcon } from '@/app/shared/icons';
import { MAX_TRANSLATION_SELECTIONS } from './useTranslationPanel';
import { TranslationResource } from '@/types';

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
}: TranslationSelectionListProps): JSX.Element => (
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
            <div
              key={id}
              draggable
              onDragStart={(e) => handleDragStart(e, id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, id)}
              onDragEnd={handleDragEnd}
              className={`flex items-center justify-between p-3 rounded-lg cursor-grab active:cursor-grabbing transition-all duration-200 ${
                draggedId === id ? 'opacity-50' : 'opacity-100'
              } bg-surface border border-border hover:bg-accent/10`}
            >
              <div className="flex items-center min-w-0">
                <GripVerticalIcon className="h-4 w-4 mr-3 flex-shrink-0 text-muted" />
                <span className="font-medium text-sm truncate text-foreground">{item.name}</span>
              </div>
              <button
                onClick={() => handleSelectionToggle(id)}
                className="hover:text-accent hover:bg-accent/10 transition-all duration-200 p-1.5 rounded-full flex-shrink-0 ml-2 text-muted"
              >
                <CloseIcon size={14} strokeWidth={2.5} />
              </button>
            </div>
          );
        })
      )}
    </div>
  </div>
);

export default TranslationSelectionList;
