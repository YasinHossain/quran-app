'use client';

import React from 'react';
import { GripVertical, X } from 'lucide-react';
import { TafsirResource } from '@/types';
import { MAX_SELECTIONS } from './tafsirPanel.utils';

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

export const TafsirSelectionList: React.FC<TafsirSelectionListProps> = ({
  orderedSelection,
  tafsirs,
  handleSelectionToggle,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
  draggedId,
}) => (
  <div>
    <h2 className="text-sm font-semibold px-1 mb-2 flex items-center justify-between text-muted">
      <span>
        MY SELECTIONS ({orderedSelection.length}/{MAX_SELECTIONS})
      </span>
      {orderedSelection.length >= MAX_SELECTIONS && (
        <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">MAX</span>
      )}
    </h2>
    <div className="space-y-2 min-h-[40px] rounded-lg p-2 bg-background border border-border">
      {orderedSelection.length === 0 ? (
        <p className="text-center text-sm py-2 text-muted">No tafsirs selected</p>
      ) : (
        orderedSelection.map((id) => {
          const item = tafsirs.find((t) => t.id === id);
          if (!item) return null;
          return (
            <div
              key={id}
              draggable
              onDragStart={(e) => handleDragStart(e, id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, id)}
              onDragEnd={handleDragEnd}
              className={`flex items-center justify-between p-2 rounded-lg shadow-sm cursor-grab active:cursor-grabbing transition-opacity border ${
                draggedId === id ? 'opacity-50' : 'opacity-100'
              } bg-background border-border`}
            >
              <div className="flex items-center min-w-0">
                <GripVertical className="h-5 w-5 mr-2 flex-shrink-0 text-muted" />
                <span className="font-medium text-sm truncate text-foreground">{item.name}</span>
              </div>
              <button
                onClick={() => handleSelectionToggle(id)}
                className="hover:text-accent transition-colors p-1 rounded-full flex-shrink-0 ml-2 text-muted"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>
          );
        })
      )}
    </div>
  </div>
);
