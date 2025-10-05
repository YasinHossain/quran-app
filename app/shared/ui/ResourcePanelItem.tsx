'use client';

import React, { memo } from 'react';

import { CheckIcon } from '@/app/shared/icons';

import type { ResourceItem } from './ResourcePanel.types';

interface ResourcePanelItemProps<T extends ResourceItem> {
  item: T;
  isSelected: boolean;
  onSelect: () => void;
}

export const ResourcePanelItem = memo(function ResourcePanelItem<T extends ResourceItem>({
  item,
  isSelected,
  onSelect,
}: ResourcePanelItemProps<T>): React.JSX.Element {
  return (
    <button
      key={item.id}
      onClick={onSelect}
      className={`w-full text-left p-3 rounded-lg transition-colors ${
        isSelected
          ? 'bg-accent/20 text-accent border border-accent/30'
          : 'hover:bg-interactive/50 text-foreground'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">{item.name}</h4>
          {item.description && (
            <p className="text-sm text-muted mt-1 line-clamp-2">{item.description}</p>
          )}
          {item.meta && <p className="text-xs text-muted mt-1">{item.meta}</p>}
        </div>
        {isSelected && <CheckIcon size={18} className="text-accent ml-2 flex-shrink-0" />}
      </div>
    </button>
  );
}) as <T extends ResourceItem>(props: ResourcePanelItemProps<T>) => React.JSX.Element;
