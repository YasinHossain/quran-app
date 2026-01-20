import React, { useMemo, memo } from 'react';
import { FixedSizeList as List, ListChildComponentProps, areEqual } from 'react-window';

import { ResourceItem, Resource } from './ResourceItem';

interface ItemData {
  resources: Resource[];
  selectedIds: Set<number | string>;
  onToggle: (id: number | string) => void;
}

const Row = memo(({ index, style, data }: ListChildComponentProps<ItemData>) => {
  const { resources, selectedIds, onToggle } = data;
  const item = resources[index];
  if (!item) return <div style={style} />;
  return (
    <div style={style}>
      <div className="pb-2">
        <ResourceItem
          key={item.id}
          item={item}
          isSelected={selectedIds.has(item.id)}
          onToggle={onToggle}
        />
      </div>
    </div>
  );
}, areEqual);

Row.displayName = 'ResourceListRow';

interface ResourceListProps<T extends Resource> {
  resources: T[];
  rowHeight: number;
  selectedIds: Set<number | string>;
  onToggle: (id: number | string) => void;
  height: number;
}

export const ResourceList = <T extends Resource>({
  resources,
  rowHeight,
  selectedIds,
  onToggle,
  height,
}: ResourceListProps<T>): React.JSX.Element => {
  const itemCount = resources.length;

  const itemData = useMemo(
    () => ({
      resources,
      selectedIds,
      onToggle,
    }),
    [resources, selectedIds, onToggle]
  );

  return (
    <List
      height={Math.min(height, itemCount * rowHeight)}
      width="100%"
      itemCount={itemCount}
      itemSize={rowHeight}
      itemData={itemData}
    >
      {Row}
    </List>
  );
};
