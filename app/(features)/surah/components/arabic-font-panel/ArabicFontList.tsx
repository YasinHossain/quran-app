'use client';

import { ResourceList } from '@/app/shared/resource-panel';

import type { useArabicFontPanel } from '@/app/(features)/surah/components/panels/arabic-font-panel/useArabicFontPanel';

type ArabicFont = ReturnType<typeof useArabicFontPanel>['fonts'][number];

interface ArabicFontListProps {
  resources: ArabicFont[];
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
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
