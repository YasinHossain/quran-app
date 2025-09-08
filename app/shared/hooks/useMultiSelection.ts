'use client';

import { useCallback } from 'react';

import { selectionOperations } from './multiSelection/selectionOperations';
import { useSelectionState } from './multiSelection/useSelectionState';

import type { UseMultiSelectionOptions, UseMultiSelectionReturn } from './multiSelection/types';

/**
 * Custom hook for managing multi-selection state
 * Provides consistent multi-selection behavior across components
 */
export function useMultiSelection<T>(
  options: UseMultiSelectionOptions<T> = {}
): UseMultiSelectionReturn<T> {
  const { defaultSelected = [], maxSelection, onSelectionChange } = options;

  const { selected, setSelected } = useSelectionState(defaultSelected, onSelectionChange);

  const select = useCallback(
    (item: T) => {
      setSelected((current: T[]) => selectionOperations.addItem(current, item, maxSelection));
    },
    [setSelected, maxSelection]
  );

  const deselect = useCallback(
    (item: T) => {
      setSelected((current: T[]) => selectionOperations.removeItem(current, item));
    },
    [setSelected]
  );

  const toggle = useCallback(
    (item: T) => {
      setSelected((current: T[]) => selectionOperations.toggleItem(current, item, maxSelection));
    },
    [setSelected, maxSelection]
  );

  const clear = useCallback(() => {
    setSelected([]);
  }, [setSelected]);

  const selectAll = useCallback(
    (items: T[]) => {
      const itemsToSelect = selectionOperations.selectFromList(items, maxSelection);
      setSelected(itemsToSelect);
    },
    [setSelected, maxSelection]
  );

  const isSelected = useCallback(
    (item: T) => selectionOperations.isItemSelected(selected, item),
    [selected]
  );

  const hasSelection = selected.length > 0;
  const selectionCount = selected.length;

  return {
    selected,
    select,
    deselect,
    toggle,
    clear,
    selectAll,
    isSelected,
    setSelected,
    hasSelection,
    selectionCount,
  };
}

// Re-export types for convenience
export type { UseMultiSelectionOptions, UseMultiSelectionReturn } from './multiSelection/types';
