'use client';

import React from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';

import { ResourceItem } from './ResourceItem';

interface Resource {
  id: number | string;
  name: string;
  lang: string;
}

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

  const Row = ({ index, style }: ListChildComponentProps): React.JSX.Element => {
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
  };

  return (
    <List
      height={Math.min(height, itemCount * rowHeight)}
      width="100%"
      itemCount={itemCount}
      itemSize={rowHeight}
    >
      {Row}
    </List>
  );
};
