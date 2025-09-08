'use client';

import React, { useState, useMemo } from 'react';

import { SearchInput } from '@/app/shared/components/SearchInput';
import { CheckIcon } from '@/app/shared/icons';
import { Spinner } from '@/app/shared/Spinner';

import { Panel } from './Panel';

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

export function ResourcePanel<T extends ResourceItem>({
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
  const [internalSearchTerm, setInternalSearchTerm] = useState('');

  const filteredItems = useMemo((): T[] => {
    if (!internalSearchTerm.trim()) return items;

    const searchLower = internalSearchTerm.toLowerCase().trim();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower) ||
        item.meta?.toLowerCase().includes(searchLower)
    );
  }, [items, internalSearchTerm]);

  const defaultRenderItem = (
    item: T,
    isSelected: boolean,
    onSelectItem: () => void
  ): React.JSX.Element => (
    <button
      key={item.id}
      onClick={onSelectItem}
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

  return (
    <Panel
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      variant={variant}
      className="flex flex-col h-full"
    >
      <div className="flex-1 flex flex-col min-h-0">
        {/* Search */}
        <div className="p-4 pb-2 border-b border-border">
          <SearchInput
            value={internalSearchTerm}
            onChange={setInternalSearchTerm}
            placeholder={searchPlaceholder}
            variant="panel"
            size="sm"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner className="h-6 w-6" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-8 text-muted">
              <p>{emptyStateMessage}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredItems.map((item): React.JSX.Element => {
                const isSelected = item.id === selectedId;
                const handleSelect = (): void => {
                  onSelect(item.id);
                  onClose();
                };

                return renderItem
                  ? renderItem(item, isSelected, handleSelect)
                  : defaultRenderItem(item, isSelected, handleSelect);
              })}
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}
