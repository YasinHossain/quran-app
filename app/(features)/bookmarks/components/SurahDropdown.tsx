import React from 'react';

import { Chapter } from '@/types';

import { SurahOption } from './SurahOption';
import { SurahSearchInput } from './SurahSearchInput';

interface SurahDropdownProps {
  chapters: Chapter[];
  value: number | undefined;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSelect: (chapter: Chapter) => void;
  searchInputRef: React.MutableRefObject<HTMLInputElement | null>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const SurahDropdown = ({
  chapters,
  value,
  searchTerm,
  setSearchTerm,
  onSelect,
  searchInputRef,
  handleKeyDown,
}: SurahDropdownProps): React.JSX.Element => {
  const filtered = chapters.filter(
    (c) =>
      c.name_simple.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name_arabic.includes(searchTerm) ||
      c.id.toString().includes(searchTerm)
  );
  const renderSurahOption = (chapter: Chapter): React.JSX.Element => (
    <SurahOption
      key={chapter.id}
      chapter={chapter}
      selected={value === chapter.id}
      onSelect={onSelect}
    />
  );

  return (
    <div className="absolute z-50 w-full mt-2 bg-surface border border-border rounded-xl shadow-xl max-h-80 overflow-hidden">
      <SurahSearchInput
        inputRef={searchInputRef}
        value={searchTerm}
        onChange={setSearchTerm}
        onKeyDown={handleKeyDown}
      />
      <div className="overflow-y-auto max-h-64">
        {filtered.length > 0 ? (
          filtered.map(renderSurahOption)
        ) : (
          <div className="p-4 text-center text-muted text-sm">
            No surahs found matching &quot;{searchTerm}&quot;
          </div>
        )}
      </div>
    </div>
  );
};
