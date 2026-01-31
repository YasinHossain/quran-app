'use client';

import React, { memo, useCallback, useMemo } from 'react';

import {
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  GripVerticalIcon,
  ResetIcon,
} from '@/app/shared/icons';

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
    maxBadgeClassName: 'text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-medium',
    containerClassName: 'space-y-2 min-h-[60px] rounded-lg p-3 bg-surface border border-border',
    emptyTextClassName: 'text-center text-sm py-4 text-muted font-medium',
    itemRowClassName:
      'flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:bg-accent/10 transition-colors',
    gripIconClassName: 'h-5 w-5',
    removeButtonClassName:
      'hover:text-accent hover:bg-accent/10 transition-all duration-200 p-1.5 rounded-full flex-shrink-0 ml-2 text-muted',
    removeIconSize: 14,
  },
  tafsir: {
    headerClassName: 'text-sm font-semibold px-1 mb-2 flex items-center justify-between text-muted',
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
  onReorder?: ((ids: number[]) => void) | undefined;
  onReset?: (() => void) | undefined;
  maxSelections: number;
  emptyText: string;
  variant: SelectionListVariant;
  removeAriaLabel?: string | undefined;
}

export const ReorderableSelectionList = memo(function ReorderableSelectionList(
  props: ReorderableSelectionListProps
): React.JSX.Element {
  const styles = VARIANT_STYLES[props.variant];

  const [localOrder, setLocalOrder] = React.useState(props.orderedSelection);

  React.useEffect(() => {
    setLocalOrder(props.orderedSelection);
  }, [props.orderedSelection]);

  const resourceById = useMemo(() => {
    const map = new Map<number, BasicResource>();
    for (const resource of props.resources) {
      map.set(resource.id, resource);
    }
    return map;
  }, [props.resources]);

  const canReorder = typeof props.onReorder === 'function' && localOrder.length > 1;

  const move = useCallback(
    (id: number, direction: -1 | 1) => {
      const currentIndex = localOrder.indexOf(id);
      if (currentIndex === -1) return;
      const nextIndex = currentIndex + direction;
      if (nextIndex < 0 || nextIndex >= localOrder.length) return;

      const next = [...localOrder];
      const temp = next[currentIndex];
      next[currentIndex] = next[nextIndex]!;
      next[nextIndex] = temp!;

      setLocalOrder(next);
      props.onReorder?.(next);
    },
    [localOrder, props.onReorder]
  );

  const selectionCount = localOrder.length;

  return (
    <div>
      <div className={styles.headerClassName}>
        <span className="uppercase">
          MY SELECTIONS ({selectionCount}/{props.maxSelections})
        </span>
        <div className="flex items-center gap-2">
          {selectionCount >= props.maxSelections && (
            <span className={styles.maxBadgeClassName}>MAX</span>
          )}
          {props.onReset && (
            <button
              onClick={props.onReset}
              className="p-1.5 rounded-full text-foreground hover:bg-interactive-hover hover:text-accent transition-colors"
              title="Reset to Default"
            >
              <ResetIcon size={16} />
            </button>
          )}
        </div>
      </div>

      <div className={styles.containerClassName}>
        {selectionCount === 0 ? (
          <p className={styles.emptyTextClassName}>{props.emptyText}</p>
        ) : (
          <div className="space-y-2">
            {localOrder.map((id) => {
              const item = resourceById.get(id);
              if (!item) return null;

              return (
                <SelectionListItem
                  key={id}
                  item={item}
                  styles={styles}
                  onRemove={props.onRemove}
                  canReorder={canReorder}
                  onMoveUp={() => move(id, -1)}
                  onMoveDown={() => move(id, 1)}
                  isFirst={localOrder[0] === id}
                  isLast={localOrder[localOrder.length - 1] === id}
                  {...(props.removeAriaLabel !== undefined
                    ? { removeAriaLabel: props.removeAriaLabel }
                    : {})}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

function SelectionListItem({
  item,
  styles,
  onRemove,
  canReorder,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  removeAriaLabel,
}: {
  item: BasicResource;
  styles: VariantStyles;
  onRemove: (id: number) => void;
  canReorder: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  removeAriaLabel?: string;
}): React.JSX.Element {
  return (
    <div className={styles.itemRowClassName}>
      <div className="flex items-center min-w-0">
        <div className="p-1 mr-2 text-muted">
          <GripVerticalIcon className={styles.gripIconClassName} />
        </div>
        <span className="font-medium text-sm truncate text-foreground select-none">
          {item.name}
        </span>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        {canReorder && (
          <div className="flex flex-col">
            <button
              type="button"
              onClick={onMoveUp}
              disabled={isFirst}
              className="rounded-md p-1 text-muted hover:text-foreground hover:bg-interactive-hover disabled:opacity-40 disabled:hover:bg-transparent"
              aria-label="Move up"
            >
              <ChevronUpIcon size={16} />
            </button>
            <button
              type="button"
              onClick={onMoveDown}
              disabled={isLast}
              className="rounded-md p-1 text-muted hover:text-foreground hover:bg-interactive-hover disabled:opacity-40 disabled:hover:bg-transparent"
              aria-label="Move down"
            >
              <ChevronDownIcon size={16} />
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className={styles.removeButtonClassName}
          {...(removeAriaLabel ? { 'aria-label': removeAriaLabel } : {})}
        >
          <CloseIcon size={styles.removeIconSize} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
