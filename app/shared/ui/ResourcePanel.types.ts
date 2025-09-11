import type { ResourceSelectionProps } from '@/types/components';
import type { ReactNode } from 'react';

export interface ResourceItem {
  id: string | number;
  name: string;
  description?: string;
  meta?: string;
}

export interface ResourcePanelProps<T extends ResourceItem> extends ResourceSelectionProps<T> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  emptyStateMessage?: string;
  searchPlaceholder?: string;
  variant?: 'sidebar' | 'modal';
  renderItem?: (item: T, isSelected: boolean, onSelect: () => void) => ReactNode;
}
