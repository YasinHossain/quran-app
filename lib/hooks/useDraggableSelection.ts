import { useCallback, useState } from 'react';

export interface UseDraggableSelectionResult {
  orderedSelection: number[];
  setOrderedSelection: React.Dispatch<React.SetStateAction<number[]>>;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, targetId: number) => void;
  handleDragEnd: () => void;
  draggedId: number | null;
}

export const useDraggableSelection = (initialOrder: number[] = []): UseDraggableSelectionResult => {
  const [orderedSelection, setOrderedSelection] = useState<number[]>(initialOrder);
  const [draggedId, setDraggedId] = useState<number | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, id: number) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

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
        if (from === -1 || to === -1 || item === undefined) {
          return prev;
        }
        newOrder.splice(to, 0, item);
        return newOrder;
      });
      setDraggedId(null);
    },
    [draggedId]
  );

  const handleDragEnd = useCallback(() => setDraggedId(null), []);

  return {
    orderedSelection,
    setOrderedSelection,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    draggedId,
  };
};
