import { useCallback, useMemo, useState } from 'react';

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

interface SelectableResult<T extends Resource> {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  languages: string[];
  groupedResources: Record<string, T[]>;
  activeFilter: string;
  setActiveFilter: (lang: string) => void;
  selectedIds: Set<number>;
  orderedSelection: number[];
  handleSelectionToggle: (id: number) => boolean;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, targetId: number) => void;
  handleDragEnd: () => void;
  draggedId: number | null;
  setSelections: (ids: number[]) => void;
}

export const useSelectableResources = <T extends Resource>({
  resources,
  selectionLimit,
  initialSelectedIds = [],
  languageSort,
}: SelectableOptions<T>): SelectableResult<T> => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set(initialSelectedIds));
  const [orderedSelection, setOrderedSelection] = useState<number[]>(initialSelectedIds);
  const [draggedId, setDraggedId] = useState<number | null>(null);

  const setSelections = useCallback(
    (ids: number[]): void => {
      setSelectedIds(new Set(ids));
      setOrderedSelection(ids);
    },
    [setOrderedSelection, setSelectedIds]
  );

  const languages = useMemo(() => {
    const unique = Array.from(new Set(resources.map((r) => r.lang)));
    const sorted = languageSort
      ? unique.sort(languageSort)
      : unique.sort((a, b) => a.localeCompare(b));
    return ['All', ...sorted];
  }, [resources, languageSort]);

  const filteredResources = useMemo(() => {
    if (searchTerm === '') return resources;
    const lower = searchTerm.toLowerCase();
    return resources.filter(
      (r) => r.name.toLowerCase().includes(lower) || r.lang.toLowerCase().includes(lower)
    );
  }, [resources, searchTerm]);

  const groupedResources = useMemo(
    () =>
      filteredResources.reduce(
        (acc, item) => {
          (acc[item.lang] = acc[item.lang] || []).push(item);
          return acc;
        },
        {} as Record<string, T[]>
      ),
    [filteredResources]
  );

  const handleSelectionToggle = useCallback(
    (id: number): boolean => {
      const newSelected = new Set(selectedIds);
      let newOrder = [...orderedSelection];
      let changed = false;

      if (newSelected.has(id)) {
        newSelected.delete(id);
        newOrder = newOrder.filter((i) => i !== id);
        changed = true;
      } else {
        if (newSelected.size >= selectionLimit) return false;
        newSelected.add(id);
        newOrder.push(id);
        changed = true;
      }

      if (changed) {
        setSelectedIds(newSelected);
        setOrderedSelection(newOrder);
      }
      return changed;
    },
    [orderedSelection, selectedIds, selectionLimit, setOrderedSelection, setSelectedIds]
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, id: number) => {
      setDraggedId(id);
      e.dataTransfer.effectAllowed = 'move';
    },
    [setDraggedId]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, targetId: number) => {
      e.preventDefault();
      if (draggedId === null || draggedId === targetId) {
        setDraggedId(null);
        return;
      }
      setOrderedSelection((prev) => {
        const newOrder = [...prev];
        const from = newOrder.indexOf(draggedId);
        const to = newOrder.indexOf(targetId);
        const [item] = newOrder.splice(from, 1);
        newOrder.splice(to, 0, item);
        return newOrder;
      });
      setDraggedId(null);
    },
    [draggedId, setDraggedId, setOrderedSelection]
  );

  const handleDragEnd = useCallback(() => setDraggedId(null), [setDraggedId]);

  return {
    searchTerm,
    setSearchTerm,
    languages,
    groupedResources,
    activeFilter,
    setActiveFilter,
    selectedIds,
    orderedSelection,
    handleSelectionToggle,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    draggedId,
    setSelections,
  } as const;
};
