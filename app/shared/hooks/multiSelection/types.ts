export interface UseMultiSelectionOptions<T> {
  defaultSelected?: T[];
  maxSelection?: number;
  onSelectionChange?: (selected: T[]) => void;
}

export interface UseMultiSelectionReturn<T> {
  selected: T[];
  select: (item: T) => void;
  deselect: (item: T) => void;
  toggle: (item: T) => void;
  clear: () => void;
  selectAll: (items: T[]) => void;
  isSelected: (item: T) => boolean;
  setSelected: (items: T[]) => void;
  hasSelection: boolean;
  selectionCount: number;
}
