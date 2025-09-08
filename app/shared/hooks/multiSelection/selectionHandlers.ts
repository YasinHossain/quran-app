import { selectionOperations } from './selectionOperations';

export const createSelect = <T>(
  setSelected: (updater: T[] | ((current: T[]) => T[])) => void,
  maxSelection?: number
) => {
  return (item: T) => {
    setSelected((current: T[]) => selectionOperations.addItem(current, item, maxSelection));
  };
};

export const createDeselect = <T>(
  setSelected: (updater: T[] | ((current: T[]) => T[])) => void
) => {
  return (item: T) => {
    setSelected((current: T[]) => selectionOperations.removeItem(current, item));
  };
};

export const createToggle = <T>(
  setSelected: (updater: T[] | ((current: T[]) => T[])) => void,
  maxSelection?: number
) => {
  return (item: T) => {
    setSelected((current: T[]) => selectionOperations.toggleItem(current, item, maxSelection));
  };
};

export const createClear = <T>(setSelected: (items: T[]) => void) => {
  return () => {
    setSelected([]);
  };
};

export const createSelectAll = <T>(setSelected: (items: T[]) => void, maxSelection?: number) => {
  return (items: T[]) => {
    const itemsToSelect = selectionOperations.selectFromList(items, maxSelection);
    setSelected(itemsToSelect);
  };
};

export const createIsSelected = <T>(selected: T[]) => {
  return (item: T) => selectionOperations.isItemSelected(selected, item);
};
