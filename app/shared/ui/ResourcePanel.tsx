'use client';

import React, { useState, useMemo } from 'react';
import { memo } from 'react';

import { Panel } from './Panel';
import { ResourcePanelList } from './ResourcePanelList';
import { ResourcePanelSearch } from './ResourcePanelSearch';

import type { ResourceSelectionProps } from '@/types/components';

interface ResourceItem {
  id: string | number;
  name: string;
  description?: string;
  meta?: string;
}

interface ResourcePanelProps<T extends ResourceItem> extends ResourceSelectionProps<T> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  emptyStateMessage?: string;
  searchPlaceholder?: string;
  variant?: 'sidebar' | 'modal';
  renderItem?: (item: T, isSelected: boolean, onSelect: () => void) => React.ReactNode;
}

export const ResourcePanel = memo(function ResourcePanel<T extends ResourceItem>({
  isOpen,
  onClose,
  title,
  items,
  selectedId,
  onSelect,
  loading = false,
  emptyStateMessage = 'No items found',
  searchPlaceholder = 'Search...',
  variant = 'sidebar',
  renderItem,
}: ResourcePanelProps<T>): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo((): T[] => {
    if (!searchTerm.trim()) return items;
    const searchLower = searchTerm.toLowerCase().trim();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower) ||
        item.meta?.toLowerCase().includes(searchLower)
    );
  }, [items, searchTerm]);

  return (
    <Panel
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      variant={variant}
      className="flex flex-col h-full"
    >
      <div className="flex-1 flex flex-col min-h-0">
        <ResourcePanelSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder={searchPlaceholder}
        />
        <div className="flex-1 overflow-y-auto p-4">
          <ResourcePanelList
            items={filteredItems}
            selectedId={selectedId}
            onSelect={onSelect}
            onClose={onClose}
            loading={loading}
            emptyStateMessage={emptyStateMessage}
            renderItem={renderItem}
          />
        </div>
      </div>
    </Panel>
  );
});
