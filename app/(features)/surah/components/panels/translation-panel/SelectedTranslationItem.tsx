'use client';

import React from 'react';

import { GripVerticalIcon, CloseIcon } from '@/app/shared/icons';

import type { TranslationResource } from '@/types';

type SelectedTranslationItemProps = {
  item: TranslationResource;
  isDragging: boolean;
  onRemove: (id: number) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  onDragEnd: () => void;
};

export function SelectedTranslationItem({
  item,
  isDragging,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: SelectedTranslationItemProps): React.JSX.Element {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, item.id)}
      onDragEnd={onDragEnd}
      className={`flex items-center justify-between p-3 rounded-lg cursor-grab active:cursor-grabbing transition-all duration-200 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } bg-surface border border-border hover:bg-accent/10`}
    >
      <div className="flex items-center min-w-0">
        <GripVerticalIcon className="h-4 w-4 mr-3 flex-shrink-0 text-muted" />
        <span className="font-medium text-sm truncate text-foreground">{item.name}</span>
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="hover:text-accent hover:bg-accent/10 transition-all duration-200 p-1.5 rounded-full flex-shrink-0 ml-2 text-muted"
        aria-label="Remove translation"
      >
        <CloseIcon size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}
