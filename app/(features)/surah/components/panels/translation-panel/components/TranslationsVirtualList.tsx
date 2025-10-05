'use client';

import { ResourceList } from '@/app/shared/resource-panel';

import type { TranslationResource } from '@/types';

interface TranslationsVirtualListProps {
  resources: TranslationResource[];
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
  height: number;
}

export function TranslationsVirtualList({
  resources,
  selectedIds,
  onToggle,
  height,
}: TranslationsVirtualListProps): React.JSX.Element {
  return (
    <ResourceList
      resources={resources}
      rowHeight={58}
      selectedIds={selectedIds}
      onToggle={onToggle}
      height={height}
    />
  );
}
