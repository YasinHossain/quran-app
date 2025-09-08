'use client';

import { ResourceList } from '@/app/shared/resource-panel';

import type { TafsirResource } from '@/types';

interface TafsirVirtualListProps {
  resources: TafsirResource[];
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
  height: number;
  total: number;
}

export function TafsirVirtualList({
  resources,
  selectedIds,
  onToggle,
  height,
  total,
}: TafsirVirtualListProps): React.JSX.Element {
  return (
    <div className="px-4 pb-4 pt-4">
      {resources.length > 0 ? (
        <ResourceList
          resources={resources}
          rowHeight={58}
          selectedIds={selectedIds}
          onToggle={onToggle}
          height={height}
        />
      ) : (
        <div className="text-center text-muted py-8">
          {total === 0
            ? 'Loading tafsir resources...'
            : 'No tafsir resources found for the selected filter.'}
        </div>
      )}
    </div>
  );
}
