import { useState, useCallback } from 'react';

export const useSelectionState = <T>(
  defaultSelected: T[],
  onSelectionChange?: (selected: T[]) => void
) => {
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

  return { selected, setSelected };
};
