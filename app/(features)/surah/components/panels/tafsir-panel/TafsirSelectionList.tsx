'use client';

import React from 'react';

import { GripVerticalIcon, CloseIcon } from '@/app/shared/icons';
import { TafsirResource } from '@/types';

import { MAX_TAFSIR_SELECTIONS } from './tafsirPanel.utils';

function SelectionHeader({ selectionCount }: { selectionCount: number }): React.JSX.Element {
  return (
    <h2 className="text-sm font-semibold px-1 mb-2 flex items-center justify-between text-muted">
      <span>
        MY SELECTIONS ({selectionCount}/{MAX_TAFSIR_SELECTIONS})
      </span>
      {selectionCount >= MAX_TAFSIR_SELECTIONS && (
        <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">MAX</span>
      )}
    </h2>
  );
}

function EmptySelectionState(): React.JSX.Element {
  return <p className="text-center text-sm py-2 text-muted">No tafsirs selected</p>;
}

function DraggableTafsirItem({
  id,
  item,
  isDragged,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onToggle,
}: {
  id: number;
  item: TafsirResource;
  isDragged: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  onDragEnd: () => void;
  onToggle: (id: number) => void;
}): React.JSX.Element {
  return (
    <div
      key={id}
      draggable
      onDragStart={(e) => onDragStart(e, id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, id)}
      onDragEnd={onDragEnd}
      className={`flex items-center justify-between p-2 rounded-lg shadow-sm cursor-grab active:cursor-grabbing transition-opacity border ${
        isDragged ? 'opacity-50' : 'opacity-100'
      } bg-background border-border`}
    >
      <div className="flex items-center min-w-0">
        <GripVerticalIcon className="h-5 w-5 mr-2 flex-shrink-0 text-muted" />
        <span className="font-medium text-sm truncate text-foreground">{item.name}</span>
      </div>
      <button
        onClick={() => onToggle(id)}
        className="hover:text-accent transition-colors p-1 rounded-full flex-shrink-0 ml-2 text-muted"
      >
        <CloseIcon size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}

interface TafsirSelectionListProps {
  orderedSelection: number[];
  tafsirs: TafsirResource[];
  handleSelectionToggle: (id: number) => void;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  handleDragEnd: () => void;
  draggedId: number | null;
}

export const TafsirSelectionList = ({
  orderedSelection,
  tafsirs,
  handleSelectionToggle,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
  draggedId,
}: TafsirSelectionListProps): React.JSX.Element => {
  const renderSelectionItems = () => {
    if (orderedSelection.length === 0) {
      return <EmptySelectionState />;
    }

    return orderedSelection.map((id) => {
      const item = tafsirs.find((t) => t.id === id);
      if (!item) return null;

      return (
        <DraggableTafsirItem
          key={id}
          id={id}
          item={item}
          isDragged={draggedId === id}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
          onToggle={handleSelectionToggle}
        />
      );
    });
  };

  return (
    <div>
      <SelectionHeader selectionCount={orderedSelection.length} />
      <div className="space-y-2 min-h-[40px] rounded-lg p-2 bg-background border border-border">
        {renderSelectionItems()}
      </div>
    </div>
  );
};
