'use client';
import React from 'react';

import { GripVerticalIcon, CloseIcon } from '@/app/shared/icons';

interface ArabicFont {
  id: number;
  name: string;
  value: string;
  category: string;
  lang: string;
}

interface ArabicFontSelectionListProps {
  orderedSelection: number[];
  fonts: ArabicFont[];
  handleSelectionToggle: (id: number) => void;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  handleDragEnd: () => void;
  draggedId: number | null;
}

const renderFontItem = (
  item: ArabicFont,
  id: number,
  handlers: {
    handleDragStart: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
    handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    handleDrop: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
    handleDragEnd: () => void;
    handleSelection: (id: number) => void;
  },
  draggedId: number | null
): React.JSX.Element => (
  <div
    key={id}
    draggable
    onDragStart={(e) => handlers.handleDragStart(e, id)}
    onDragOver={handlers.handleDragOver}
    onDrop={(e) => handlers.handleDrop(e, id)}
    onDragEnd={handlers.handleDragEnd}
    className={`flex items-center justify-between p-3 rounded-lg cursor-grab active:cursor-grabbing transition-all duration-200 ${
      draggedId === id ? 'opacity-50' : 'opacity-100'
    } bg-surface border border-border hover:bg-accent/10`}
  >
    <div className="flex items-center min-w-0">
      <GripVerticalIcon className="h-4 w-4 mr-3 flex-shrink-0 text-muted" />
      <div className="min-w-0">
        <span className="font-medium text-sm block truncate text-foreground">{item.name}</span>
        <span className="text-xs text-muted">{item.category}</span>
      </div>
    </div>
    <button
      onClick={() => handlers.handleSelection(id)}
      className="hover:text-accent hover:bg-accent/10 transition-all duration-200 p-1.5 rounded-full flex-shrink-0 ml-2 text-muted"
    >
      <CloseIcon size={14} strokeWidth={2.5} />
    </button>
  </div>
);

export const ArabicFontSelectionList = ({
  orderedSelection,
  fonts,
  handleSelectionToggle,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
  draggedId,
}: ArabicFontSelectionListProps): React.JSX.Element => {
  const handleSelection = (id: number): void => handleSelectionToggle(id);

  return (
    <div>
      <h2 className="text-sm font-semibold px-2 mb-3 flex items-center justify-between text-muted">
        <span>SELECTED FONT ({orderedSelection.length}/1)</span>
        {orderedSelection.length >= 1 && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-medium">
            ACTIVE
          </span>
        )}
      </h2>
      <div className="space-y-2 min-h-[60px] rounded-lg p-3 bg-surface border border-border">
        {orderedSelection.length === 0 ? (
          <p className="text-center text-sm py-4 text-muted font-medium">No Arabic font selected</p>
        ) : (
          orderedSelection.map((id) => {
            const item = fonts.find((font) => font.id === id);
            if (!item) return null;
            return renderFontItem(
              item,
              id,
              { handleDragStart, handleDragOver, handleDrop, handleDragEnd, handleSelection },
              draggedId
            );
          })
        )}
      </div>
    </div>
  );
};
