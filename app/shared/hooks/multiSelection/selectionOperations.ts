export const selectionOperations = {
  addItem: <T>(current: T[], item: T, maxSelection?: number): T[] => {
    if (current.includes(item)) return current;
    if (maxSelection && current.length >= maxSelection) return current;
    return [...current, item];
  },

  removeItem: <T>(current: T[], item: T): T[] => {
    return current.filter((i: T) => i !== item);
  },

  toggleItem: <T>(current: T[], item: T, maxSelection?: number): T[] => {
    if (current.includes(item)) {
      return current.filter((i: T) => i !== item);
    } else if (!maxSelection || current.length < maxSelection) {
      return [...current, item];
    }
    return current;
  },

  selectFromList: <T>(items: T[], maxSelection?: number): T[] => {
    return maxSelection ? items.slice(0, maxSelection) : items;
  },

  isItemSelected: <T>(selected: T[], item: T): boolean => {
    return selected.includes(item);
  },
};
