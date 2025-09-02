'use client';

import { useState, useCallback } from 'react';

export interface UseSelectionOptions<T> {
  defaultSelected?: T | null;
  onSelectionChange?: (selected: T | null) => void;
}

export interface UseSelectionReturn<T> {
  selected: T | null;
  select: (item: T) => void;
  deselect: () => void;
  toggle: (item: T) => void;
  isSelected: (item: T) => boolean;
  setSelected: (item: T | null) => void;
}

/**
 * Custom hook for managing single selection state
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
