'use client';

import React from 'react';
import { Reorder, useDragControls } from 'framer-motion';

import { GripVerticalIcon, CloseIcon } from '@/app/shared/icons';
import { TranslationResource } from '@/types';

import { MAX_TRANSLATION_SELECTIONS } from './hooks/useTranslationSelection';

interface TranslationSelectionListProps {
  orderedSelection: number[];
  translations: TranslationResource[];
  handleSelectionToggle: (id: number) => void;
  onReorder?: (ids: number[]) => void;
}

function TranslationItem({
  item,
  onRemove,
  onDragEnd,
}: {
  item: TranslationResource;
  onRemove: (id: number) => void;
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
      <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border hover:bg-accent/10 transition-colors">
        <div className="flex items-center min-w-0">
          <div
            onPointerDown={(e) => controls.start(e)}
            className="cursor-grab active:cursor-grabbing touch-none p-1 mr-2 text-muted hover:text-foreground"
          >
            <GripVerticalIcon className="h-4 w-4" />
          </div>
          <span className="font-medium text-sm truncate text-foreground select-none">
            {item.name}
          </span>
        </div>
        <button
          onClick={() => onRemove(item.id)}
          className="hover:text-accent hover:bg-accent/10 transition-all duration-200 p-1.5 rounded-full flex-shrink-0 ml-2 text-muted"
          aria-label="Remove translation"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <CloseIcon size={14} strokeWidth={2.5} />
        </button>
      </div>
    </Reorder.Item>
  );
}

export const TranslationSelectionList = ({
  orderedSelection,
  translations,
  handleSelectionToggle,
  onReorder,
}: TranslationSelectionListProps): React.JSX.Element => {
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

  return (
    <div>
      <h2 className="text-sm font-semibold px-2 mb-3 flex items-center justify-between text-foreground">
        <span>
          MY SELECTIONS ({localOrder.length}/{MAX_TRANSLATION_SELECTIONS})
        </span>
        {localOrder.length >= MAX_TRANSLATION_SELECTIONS && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-medium">
            MAX
          </span>
        )}
      </h2>
      <div className="space-y-2 min-h-[60px] rounded-lg p-3 bg-surface border border-border">
        {localOrder.length === 0 ? (
          <p className="text-center text-sm py-4 text-muted font-medium">No translations selected</p>
        ) : (
          <Reorder.Group
            axis="y"
            values={localOrder}
            onReorder={handleReorder}
            className="space-y-2"
          >
            {localOrder.map((id) => {
              const item = translations.find((t) => t.id === id);
              if (!item) return null;
              return (
                <TranslationItem
                  key={id}
                  item={item}
                  onRemove={handleSelectionToggle}
                  onDragEnd={handleDragEnd}
                />
              );
            })}
          </Reorder.Group>
        )}
      </div>
    </div>
  );
};
