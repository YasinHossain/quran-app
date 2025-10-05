import { useCallback, useState, type Dispatch, type SetStateAction } from 'react';

import { useDraggableSelection, type UseDraggableSelectionResult } from './useDraggableSelection';
import { useResourceSearch, type UseResourceSearchResult } from './useResourceSearch';

const applySelections = (
  ids: number[],
  setSelectedIds: Dispatch<SetStateAction<Set<number>>>,
  setOrderedSelection: (ids: number[]) => void
): void => {
  setSelectedIds(new Set(ids));
  setOrderedSelection(ids);
};

interface ToggleParams {
  id: number;
  selectedIds: Set<number>;
  selectionLimit: number;
  setSelectedIds: Dispatch<SetStateAction<Set<number>>>;
  orderedSelection: number[];
  setOrderedSelection: (ids: number[]) => void;
}

const toggleSelection = ({
  id,
  selectedIds,
  selectionLimit,
  setSelectedIds,
  orderedSelection,
  setOrderedSelection,
}: ToggleParams): boolean => {
  const next = new Set(selectedIds);
  let order = [...orderedSelection];
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
    setOrderedSelection(order);
  }
  return changed;
};

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
  const search = useResourceSearch<T>({ resources, ...(languageSort ? { languageSort } : {}) });
  const setSelections = useCallback(
    (ids: number[]) => applySelections(ids, setSelectedIds, drag.setOrderedSelection),
    [drag]
  );

  const handleSelectionToggle = useCallback(
    (id: number) =>
      toggleSelection({
        id,
        selectedIds,
        selectionLimit,
        setSelectedIds,
        orderedSelection: drag.orderedSelection,
        setOrderedSelection: drag.setOrderedSelection,
      }),
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
