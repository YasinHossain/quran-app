import { useCallback, useState } from 'react';

import { useDraggableSelection, type UseDraggableSelectionResult } from './useDraggableSelection';
import { useResourceSearch, type UseResourceSearchResult } from './useResourceSearch';

interface Resource {
  id: number;
  name: string;
  lang: string;
}
interface SelectableOptions<T extends Resource> {
  resources: T[];
  selectionLimit: number;
  initialSelectedIds?: number[];
  languageSort?: (a: string, b: string) => number;
}

export interface UseSelectableResourcesResult<T extends Resource>
  extends UseResourceSearchResult<T>,
    Omit<UseDraggableSelectionResult, 'setOrderedSelection'> {
  selectedIds: Set<number>;
  setSelections: (ids: number[]) => void;
  handleSelectionToggle: (id: number) => boolean;
}

export const useSelectableResources = <T extends Resource>({
  resources,
  selectionLimit,
  initialSelectedIds = [],
  languageSort,
}: SelectableOptions<T>): UseSelectableResourcesResult<T> => {
  const [selectedIds, setSelectedIds] = useState(new Set(initialSelectedIds));
  const drag = useDraggableSelection(initialSelectedIds);
  const search = useResourceSearch<T>({ resources, languageSort });

  const setSelections = useCallback(
    (ids: number[]) => {
      setSelectedIds(new Set(ids));
      drag.setOrderedSelection(ids);
    },
    [drag]
  );

  const handleSelectionToggle = useCallback(
    (id: number): boolean => {
      const next = new Set(selectedIds);
      let order = [...drag.orderedSelection];
      let changed = false;
      if (next.has(id)) {
        next.delete(id);
        order = order.filter((i) => i !== id);
        changed = true;
      } else if (next.size < selectionLimit) {
        next.add(id);
        order.push(id);
        changed = true;
      }
      if (changed) {
        setSelectedIds(next);
        drag.setOrderedSelection(order);
      }
      return changed;
    },
    [drag, selectedIds, selectionLimit]
  );

  return {
    ...search,
    selectedIds,
    orderedSelection: drag.orderedSelection,
    handleSelectionToggle,
    handleDragStart: drag.handleDragStart,
    handleDragOver: drag.handleDragOver,
    handleDrop: drag.handleDrop,
    handleDragEnd: drag.handleDragEnd,
    draggedId: drag.draggedId,
    setSelections,
  };
};
