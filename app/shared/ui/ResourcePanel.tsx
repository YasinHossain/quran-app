'use client';

import React, { useState, useMemo, memo } from 'react';

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

interface ResourceSearchSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder: string;
}

const ResourceSearchSection = memo(function ResourceSearchSection({
  searchTerm,
  onSearchChange,
  placeholder,
}: ResourceSearchSectionProps): React.JSX.Element {
  return (
    <div className="p-4 pb-2 border-b border-border">
      <SearchInput
        value={searchTerm}
        onChange={onSearchChange}
        placeholder={placeholder}
        variant="panel"
        size="sm"
      />
    </div>
  );
});

interface ResourceLoadingStateProps {
  loading: boolean;
}

const ResourceLoadingState = memo(function ResourceLoadingState({
  loading,
}: ResourceLoadingStateProps): React.JSX.Element | null {
  if (!loading) return null;

  return (
    <div className="flex justify-center py-8">
      <Spinner className="h-6 w-6" />
    </div>
  );
});

interface ResourceEmptyStateProps {
  message: string;
}

const ResourceEmptyState = memo(function ResourceEmptyState({
  message,
}: ResourceEmptyStateProps): React.JSX.Element {
  return (
    <div className="text-center py-8 text-muted">
      <p>{message}</p>
    </div>
  );
});

interface DefaultResourceItemProps<T extends ResourceItem> {
  item: T;
  isSelected: boolean;
  onSelect: () => void;
}

const DefaultResourceItem = memo(function DefaultResourceItem<T extends ResourceItem>({
  item,
  isSelected,
  onSelect,
}: DefaultResourceItemProps<T>): React.JSX.Element {
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
}) as <T extends ResourceItem>(props: DefaultResourceItemProps<T>) => React.JSX.Element;

interface ResourceListSectionProps<T extends ResourceItem> {
  items: T[];
  selectedId: string | number | null;
  onSelect: (id: string | number) => void;
  onClose: () => void;
  loading: boolean;
  emptyStateMessage: string;
  renderItem?: (item: T, isSelected: boolean, onSelect: () => void) => React.ReactNode;
}

const ResourceListSection = memo(function ResourceListSection<T extends ResourceItem>({
  items,
  selectedId,
  onSelect,
  onClose,
  loading,
  emptyStateMessage,
  renderItem,
}: ResourceListSectionProps<T>): React.JSX.Element {
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
}) as <T extends ResourceItem>(props: ResourceListSectionProps<T>) => React.JSX.Element;

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

  return (
    <Panel
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      variant={variant}
      className="flex flex-col h-full"
    >
      <div className="flex-1 flex flex-col min-h-0">
        <ResourceSearchSection
          searchTerm={internalSearchTerm}
          onSearchChange={setInternalSearchTerm}
          placeholder={searchPlaceholder}
        />

        <div className="flex-1 overflow-y-auto p-4">
          <ResourceListSection
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
}
