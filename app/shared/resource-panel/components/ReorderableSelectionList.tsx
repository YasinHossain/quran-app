'use client';

import React, { memo } from 'react';
import { Reorder, useDragControls } from 'framer-motion';

import { CloseIcon, GripVerticalIcon } from '@/app/shared/icons';

type BasicResource = {
  id: number;
  name: string;
};

type SelectionListVariant = 'translation' | 'tafsir';

interface VariantStyles {
  headerClassName: string;
  maxBadgeClassName: string;
  containerClassName: string;
  emptyTextClassName: string;
  itemRowClassName: string;
  gripIconClassName: string;
  removeButtonClassName: string;
  removeIconSize: number;
}

const VARIANT_STYLES: Record<SelectionListVariant, VariantStyles> = {
  translation: {
    headerClassName:
      'text-sm font-semibold px-2 mb-3 flex items-center justify-between text-foreground',
    maxBadgeClassName:
      'text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-medium',
    containerClassName: 'space-y-2 min-h-[60px] rounded-lg p-3 bg-surface border border-border',
    emptyTextClassName: 'text-center text-sm py-4 text-muted font-medium',
    itemRowClassName:
      'flex items-center justify-between p-3 rounded-lg bg-surface border border-border hover:bg-accent/10 transition-colors',
    gripIconClassName: 'h-4 w-4',
    removeButtonClassName:
      'hover:text-accent hover:bg-accent/10 transition-all duration-200 p-1.5 rounded-full flex-shrink-0 ml-2 text-muted',
    removeIconSize: 14,
  },
  tafsir: {
    headerClassName:
      'text-sm font-semibold px-1 mb-2 flex items-center justify-between text-muted',
    maxBadgeClassName: 'text-xs px-2 py-1 rounded-full bg-accent/10 text-accent',
    containerClassName: 'space-y-2 min-h-[40px] rounded-lg p-2 bg-background border border-border',
    emptyTextClassName: 'text-center text-sm py-2 text-muted',
    itemRowClassName:
      'flex items-center justify-between p-2 rounded-lg border bg-background border-border shadow-sm hover:bg-accent/5 transition-colors',
    gripIconClassName: 'h-5 w-5',
    removeButtonClassName:
      'hover:text-accent transition-colors p-1 rounded-full flex-shrink-0 ml-2 text-muted',
    removeIconSize: 16,
  },
};

interface ReorderableSelectionListProps {
  orderedSelection: number[];
  resources: BasicResource[];
  onRemove: (id: number) => void;
  onReorder?: (ids: number[]) => void;
  maxSelections: number;
  emptyText: string;
  variant: SelectionListVariant;
  removeAriaLabel?: string;
}

export const ReorderableSelectionList = memo(function ReorderableSelectionList(
  props: ReorderableSelectionListProps
): React.JSX.Element {
  const styles = VARIANT_STYLES[props.variant];

  const [localOrder, setLocalOrder] = React.useState(props.orderedSelection);

  React.useEffect(() => {
    setLocalOrder(props.orderedSelection);
  }, [props.orderedSelection]);

  const handleReorder = (newOrder: number[]) => {
    setLocalOrder(newOrder);
  };

  const handleDragEnd = () => {
    if (props.onReorder) {
      props.onReorder(localOrder);
    }
  };

  const selectionCount = localOrder.length;

  return (
    <div>
      <h2 className={styles.headerClassName}>
        <span>
          MY SELECTIONS ({selectionCount}/{props.maxSelections})
        </span>
        {selectionCount >= props.maxSelections && (
          <span className={styles.maxBadgeClassName}>MAX</span>
        )}
      </h2>

      <div className={styles.containerClassName}>
        {selectionCount === 0 ? (
          <p className={styles.emptyTextClassName}>{props.emptyText}</p>
        ) : (
          <Reorder.Group
            axis="y"
            values={localOrder}
            onReorder={handleReorder}
            className="space-y-2"
          >
            {localOrder.map((id) => {
              const item = props.resources.find((resource) => resource.id === id);
              if (!item) return null;

              return (
                <SelectionListItem
                  key={id}
                  item={item}
                  styles={styles}
                  onRemove={props.onRemove}
                  onDragEnd={handleDragEnd}
                  {...(props.removeAriaLabel !== undefined
                    ? { removeAriaLabel: props.removeAriaLabel }
                    : {})}
                />
              );
            })}
          </Reorder.Group>
        )}
      </div>
    </div>
  );
});

function SelectionListItem({
  item,
  styles,
  onRemove,
  onDragEnd,
  removeAriaLabel,
}: {
  item: BasicResource;
  styles: VariantStyles;
  onRemove: (id: number) => void;
  onDragEnd: () => void;
  removeAriaLabel?: string;
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
      <div className={styles.itemRowClassName}>
        <div className="flex items-center min-w-0">
          <div
            onPointerDown={(e) => controls.start(e)}
            className="cursor-grab active:cursor-grabbing touch-none p-1 mr-2 text-muted hover:text-foreground"
          >
            <GripVerticalIcon className={styles.gripIconClassName} />
          </div>
          <span className="font-medium text-sm truncate text-foreground select-none">
            {item.name}
          </span>
        </div>

        <button
          onClick={() => onRemove(item.id)}
          className={styles.removeButtonClassName}
          {...(removeAriaLabel ? { 'aria-label': removeAriaLabel } : {})}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <CloseIcon size={styles.removeIconSize} strokeWidth={2.5} />
        </button>
      </div>
    </Reorder.Item>
  );
}
