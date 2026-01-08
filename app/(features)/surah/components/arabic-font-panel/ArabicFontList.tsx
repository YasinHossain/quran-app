'use client';

import React, { useMemo, memo, useCallback } from 'react';
import { FixedSizeList as List, ListChildComponentProps, areEqual } from 'react-window';

import { preloadFont } from '@/app/hooks/useDynamicFontLoader';
import { ResourceItem, Resource } from '@/app/shared/resource-panel/ResourceItem';

import type { useArabicFontPanel } from '@/app/(features)/surah/components/panels/arabic-font-panel/useArabicFontPanel';

type ArabicFont = ReturnType<typeof useArabicFontPanel>['fonts'][number];

interface ItemData {
  resources: ArabicFont[];
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
  onHover: (fontValue: string) => void;
}

const Row = memo(({ index, style, data }: ListChildComponentProps<ItemData>) => {
  const { resources, selectedIds, onToggle, onHover } = data;
  const item = resources[index];
  if (!item) return <div style={style} />;

  const handleMouseEnter = (): void => {
    // Preload font on hover for instant switching
    if (item.value) {
      onHover(item.value);
    }
  };

  return (
    <div style={style} onMouseEnter={handleMouseEnter}>
      <div className="pb-2">
        <ResourceItem
          key={item.id}
          item={item}
          isSelected={selectedIds.has(item.id)}
          onToggle={(id) => onToggle(id as number)}
        />
      </div>
    </div>
  );
}, areEqual);

Row.displayName = 'ArabicFontListRow';

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
  const rowHeight = 58;
  const itemCount = resources.length;

  // Preload font when user hovers over it
  const handleFontHover = useCallback((fontValue: string) => {
    preloadFont(fontValue);
  }, []);

  const itemData = useMemo(
    () => ({
      resources,
      selectedIds,
      onToggle,
      onHover: handleFontHover,
    }),
    [resources, selectedIds, onToggle, handleFontHover]
  );

  return (
    <div className="px-4 pb-4 pt-0">
      <List
        height={Math.min(height, itemCount * rowHeight)}
        width="100%"
        itemCount={itemCount}
        itemSize={rowHeight}
        itemData={itemData}
      >
        {Row}
      </List>
    </div>
  );
}
