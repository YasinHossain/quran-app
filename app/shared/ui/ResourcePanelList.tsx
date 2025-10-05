'use client';

import React, { memo } from 'react';

import { CheckIcon } from '@/app/shared/icons';
import { Spinner } from '@/app/shared/Spinner';

interface ResourceItem {
  id: string | number;
  name: string;
  description?: string;
  meta?: string;
}

interface ResourcePanelListProps<T extends ResourceItem> {
  items: T[];
  selectedId: string | number | null;
  onSelect: (id: string | number) => void;
  onClose: () => void;
  loading: boolean;
  emptyStateMessage: string;
  renderItem?: (item: T, isSelected: boolean, onSelect: () => void) => React.ReactNode;
}

const ResourceLoadingState = memo(function ResourceLoadingState({
  loading,
}: {
  loading: boolean;
}): React.JSX.Element | null {
  if (!loading) return null;

  return (
    <div className="flex justify-center py-8">
      <Spinner className="h-6 w-6" />
    </div>
  );
});

const ResourceEmptyState = memo(function ResourceEmptyState({
  message,
}: {
  message: string;
}): React.JSX.Element {
  return (
    <div className="text-center py-8 text-muted">
      <p>{message}</p>
    </div>
  );
});

const DefaultResourceItem = memo(function DefaultResourceItem<T extends ResourceItem>({
  item,
  isSelected,
  onSelect,
}: {
  item: T;
  isSelected: boolean;
  onSelect: () => void;
}): React.JSX.Element {
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
}) as <T extends ResourceItem>(props: {
  item: T;
  isSelected: boolean;
  onSelect: () => void;
}) => React.JSX.Element;
export const ResourcePanelList = memo(function ResourcePanelList<T extends ResourceItem>({
  items,
  selectedId,
  onSelect,
  onClose,
  loading,
  emptyStateMessage,
  renderItem,
}: ResourcePanelListProps<T>): React.JSX.Element {
  if (loading) {
    return <ResourceLoadingState loading={loading} />;
  }

  if (items.length === 0) {
    return <ResourceEmptyState message={emptyStateMessage} />;
  }

  return (
    <div className="space-y-2">
      {items.map((item): React.JSX.Element => {
        const isSelected = item.id === selectedId;
        const handleSelect = (): void => {
          onSelect(item.id);
          onClose();
        };

        return renderItem ? (
          (renderItem(item, isSelected, handleSelect) as React.JSX.Element)
        ) : (
          <DefaultResourceItem
            key={item.id}
            item={item}
            isSelected={isSelected}
            onSelect={handleSelect}
          />
        );
      })}
    </div>
  );
}) as <T extends ResourceItem>(props: ResourcePanelListProps<T>) => React.JSX.Element;
