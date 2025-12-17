'use client';

import React from 'react';
import { Reorder, useDragControls } from 'framer-motion';

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

function TafsirItem({
  item,
  onToggle,
  onDragEnd,
}: {
  item: TafsirResource;
  onToggle: (id: number) => void;
  onDragEnd: () => void;
}): React.JSX.Element {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={item.id}
      dragListener={false}
      dragControls={controls}
      className="relative"
      onDragEnd={onDragEnd}
    >
      <div className="flex items-center justify-between p-2 rounded-lg border bg-background border-border shadow-sm hover:bg-accent/5 transition-colors">
        <div className="flex items-center min-w-0">
          <div
            onPointerDown={(e) => controls.start(e)}
            className="cursor-grab active:cursor-grabbing touch-none p-1 mr-2 text-muted hover:text-foreground"
          >
            <GripVerticalIcon className="h-5 w-5" />
          </div>
          <span className="font-medium text-sm truncate text-foreground select-none">{item.name}</span>
        </div>
        <button
          onClick={(): void => onToggle(item.id)}
          className="hover:text-accent transition-colors p-1 rounded-full flex-shrink-0 ml-2 text-muted"
          onPointerDown={(e) => e.stopPropagation()} // Prevent drag start when clicking button
        >
          <CloseIcon size={16} strokeWidth={2.5} />
        </button>
      </div>
    </Reorder.Item>
  );
}

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
  const [localOrder, setLocalOrder] = React.useState(orderedSelection);

  React.useEffect(() => {
    setLocalOrder(orderedSelection);
  }, [orderedSelection]);

  const handleReorder = (newOrder: number[]) => {
    setLocalOrder(newOrder);
  };

  const handleDragEnd = () => {
    if (onReorder) {
      onReorder(localOrder);
    }
  };

  if (orderedSelection.length === 0) {
    return (
      <div>
        <SelectionHeader selectionCount={0} />
        <div className="space-y-2 min-h-[40px] rounded-lg p-2 bg-background border border-border">
          <EmptySelectionState />
        </div>
      </div>
    );
  }

  return (
    <div>
      <SelectionHeader selectionCount={localOrder.length} />
      <div className="space-y-2 min-h-[40px] rounded-lg p-2 bg-background border border-border">
        <Reorder.Group axis="y" values={localOrder} onReorder={handleReorder} className="space-y-2">
          {localOrder.map((id) => {
            const item = tafsirs.find((t) => t.id === id);
            if (!item) return null;

            return (
              <TafsirItem key={id} item={item} onToggle={handleSelectionToggle} onDragEnd={handleDragEnd} />
            );
          })}
        </Reorder.Group>
      </div>
    </div>
  );
};
