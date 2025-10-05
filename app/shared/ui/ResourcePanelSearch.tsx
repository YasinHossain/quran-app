'use client';

import React, { memo } from 'react';

import { SearchInput } from '@/app/shared/components/SearchInput';

interface ResourcePanelSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder: string;
}

export const ResourcePanelSearch = memo(function ResourcePanelSearch({
  searchTerm,
  onSearchChange,
  placeholder,
}: ResourcePanelSearchProps): React.JSX.Element {
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
