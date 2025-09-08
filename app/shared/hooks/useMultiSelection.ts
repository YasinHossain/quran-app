'use client';

import { useCallback } from 'react';
import { createClear, createDeselect, createIsSelected, createSelect, createSelectAll, createToggle } from './multiSelection/selectionHandlers';
import { useSelectionState } from './multiSelection/useSelectionState';
import type { UseMultiSelectionOptions, UseMultiSelectionReturn } from './multiSelection/types';

export function useMultiSelection<T>(options: UseMultiSelectionOptions<T> = {}): UseMultiSelectionReturn<T> {
  const { defaultSelected = [], maxSelection, onSelectionChange } = options;
  const { selected, setSelected } = useSelectionState(defaultSelected, onSelectionChange);

  const select = useCallback(createSelect<T>(setSelected, maxSelection), [setSelected, maxSelection]);
  const deselect = useCallback(createDeselect<T>(setSelected), [setSelected]);
  const toggle = useCallback(createToggle<T>(setSelected, maxSelection), [setSelected, maxSelection]);
  const clear = useCallback(createClear<T>(setSelected), [setSelected]);
  const selectAll = useCallback(createSelectAll<T>(setSelected, maxSelection), [setSelected, maxSelection]);
  const isSelected = useCallback(createIsSelected<T>(selected), [selected]);

  const hasSelection = selected.length > 0;
  const selectionCount = selected.length;

  return { selected, select, deselect, toggle, clear, selectAll, isSelected, setSelected, hasSelection, selectionCount };
}

export type { UseMultiSelectionOptions, UseMultiSelectionReturn } from './multiSelection/types';
