import { useState, useCallback } from 'react';

interface UseSelectionStateReturn<T> {
  selected: T[];
  setSelected: (updater: T[] | ((current: T[]) => T[])) => void;
}

export const useSelectionState = <T>(
  defaultSelected: T[],
  onSelectionChange?: (selected: T[]) => void
): UseSelectionStateReturn<T> => {
  const [selected, setSelectedState] = useState<T[]>(defaultSelected);

  const setSelected = useCallback(
    (updater: T[] | ((current: T[]) => T[])): void => {
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

  return { selected, setSelected };
};
