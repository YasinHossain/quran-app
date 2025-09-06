import { useCallback, useState } from 'react';

export const useDraggableSelection = (initialOrder: number[] = []) => {
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
  } as const;
};
