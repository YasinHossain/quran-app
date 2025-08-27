'use client';

import { useState, useCallback } from 'react';

interface UseSelectionOptions<T> {
  defaultSelected?: T | null;
  onSelectionChange?: (selected: T | null) => void;
}

interface UseSelectionReturn<T> {
  selected: T | null;
  select: (item: T) => void;
  deselect: () => void;
  toggle: (item: T) => void;
  isSelected: (item: T) => boolean;
  setSelected: (item: T | null) => void;
}

/**
 * Custom hook for managing selection state
 * Provides consistent selection behavior across components
 */
export function useSelection<T>(options: UseSelectionOptions<T> = {}): UseSelectionReturn<T> {
  const { defaultSelected = null, onSelectionChange } = options;

  const [selected, setSelectedState] = useState<T | null>(defaultSelected);

  const setSelected = useCallback(
    (item: T | null) => {
      setSelectedState(item);
      onSelectionChange?.(item);
    },
    [onSelectionChange]
  );

  const select = useCallback(
    (item: T) => {
      setSelected(item);
    },
    [setSelected]
  );

  const deselect = useCallback(() => {
    setSelected(null);
  }, [setSelected]);

  const toggle = useCallback(
    (item: T) => {
      const isCurrentlySelected = selected === item;
      setSelected(isCurrentlySelected ? null : item);
    },
    [selected, setSelected]
  );

  const isSelected = useCallback(
    (item: T) => {
      return selected === item;
    },
    [selected]
  );

  return {
    selected,
    select,
    deselect,
    toggle,
    isSelected,
    setSelected,
  };
}

interface UseMultiSelectionOptions<T> {
  defaultSelected?: T[];
  maxSelection?: number;
  onSelectionChange?: (selected: T[]) => void;
}

interface UseMultiSelectionReturn<T> {
  selected: T[];
  select: (item: T) => void;
  deselect: (item: T) => void;
  toggle: (item: T) => void;
  clear: () => void;
  selectAll: (items: T[]) => void;
  isSelected: (item: T) => boolean;
  setSelected: (items: T[]) => void;
  hasSelection: boolean;
  selectionCount: number;
}

/**
 * Custom hook for managing multi-selection state
 * Provides consistent multi-selection behavior across components
 */
export function useMultiSelection<T>(
  options: UseMultiSelectionOptions<T> = {}
): UseMultiSelectionReturn<T> {
  const { defaultSelected = [], maxSelection, onSelectionChange } = options;

  const [selected, setSelectedState] = useState<T[]>(defaultSelected);

  const setSelected = useCallback(
    (updater: T[] | ((current: T[]) => T[])) => {
      if (typeof updater === 'function') {
        setSelectedState((current) => {
          const newItems = updater(current);
          onSelectionChange?.(newItems);
          return newItems;
        });
      } else {
        setSelectedState(updater);
        onSelectionChange?.(updater);
      }
    },
    [onSelectionChange]
  );

  const select = useCallback(
    (item: T) => {
      setSelected((current: T[]) => {
        if (current.includes(item)) return current;
        if (maxSelection && current.length >= maxSelection) return current;
        return [...current, item];
      });
    },
    [setSelected, maxSelection]
  );

  const deselect = useCallback(
    (item: T) => {
      setSelected((current: T[]) => current.filter((i: T) => i !== item));
    },
    [setSelected]
  );

  const toggle = useCallback(
    (item: T) => {
      setSelected((current: T[]) => {
        if (current.includes(item)) {
          return current.filter((i: T) => i !== item);
        } else if (!maxSelection || current.length < maxSelection) {
          return [...current, item];
        }
        return current;
      });
    },
    [setSelected, maxSelection]
  );

  const clear = useCallback(() => {
    setSelected([]);
  }, [setSelected]);

  const selectAll = useCallback(
    (items: T[]) => {
      const itemsToSelect = maxSelection ? items.slice(0, maxSelection) : items;
      setSelected(itemsToSelect);
    },
    [setSelected, maxSelection]
  );

  const isSelected = useCallback(
    (item: T) => {
      return selected.includes(item);
    },
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
