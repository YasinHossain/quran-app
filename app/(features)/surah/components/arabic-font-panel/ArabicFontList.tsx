'use client';

import { ResourceList } from '@/app/shared/resource-panel';

interface ArabicFontListProps {
  resources: unknown[];
  selectedIds: number[] | string[];
  onToggle: (id: number | string) => void;
  height: number;
}

export function ArabicFontList({
  resources,
  selectedIds,
  onToggle,
  height,
}: ArabicFontListProps): React.JSX.Element {
  return (
    <div className="px-4 pb-4 pt-0">
      <ResourceList
        resources={resources}
        rowHeight={58}
        selectedIds={selectedIds}
        onToggle={onToggle}
        height={height}
      />
    </div>
  );
}
