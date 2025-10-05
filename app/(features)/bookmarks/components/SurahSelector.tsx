'use client';
import React from 'react';

import { ChevronDownIcon } from '@/app/shared/icons';
import { cn } from '@/lib/utils/cn';
import { Chapter } from '@/types';

import {
  buildButtonClasses,
  buildIconClasses,
  renderSelectedContent,
} from './surah-selector.helpers';
import { useSurahSelectorBehavior, type SurahSelectorBehaviorState } from './surah-selector.hooks';
import { SurahDropdown } from './SurahDropdown';

interface SurahSelectorProps {
  chapters: Chapter[];
  value?: number | undefined;
  onChange: (surahId: number) => void;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  className?: string | undefined;
  id?: string | undefined;
}

export const SurahSelector = ({
  chapters,
  value,
  onChange,
  placeholder = 'Select Surah',
  disabled = false,
  className,
  id,
}: SurahSelectorProps): React.JSX.Element => {
  const behavior = useSurahSelectorBehavior({ chapters, value, onChange, disabled });
  const { containerRef, open, toggleOpen, selected } = behavior;

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      <SelectorButton
        id={id}
        disabled={disabled}
        open={open}
        placeholder={placeholder}
        selected={selected}
        onClick={toggleOpen}
      />
      <SelectorDropdown behavior={behavior} />
    </div>
  );
};

function SelectorButton({
  id,
  disabled,
  open,
  placeholder,
  selected,
  onClick,
}: {
  id?: string | undefined;
  disabled: boolean;
  open: boolean;
  placeholder: string;
  selected?: Chapter | undefined;
  onClick: () => void;
}): React.JSX.Element {
  return (
    <button
      type="button"
      id={id}
      onClick={onClick}
      disabled={disabled}
      className={buildButtonClasses(disabled, open)}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {renderSelectedContent(selected, placeholder)}
      </div>
      <ChevronDownIcon size={18} className={buildIconClasses(open)} />
    </button>
  );
}

function SelectorDropdown({ behavior }: { behavior: SurahSelectorBehaviorState }): React.JSX.Element | null {
  const { open, chapters, value, term, setTerm, selectSurah, inputRef, handleKeyDown } = behavior;
  if (!open) return null;
  return (
    <SurahDropdown
      chapters={chapters}
      value={value}
      searchTerm={term}
      setSearchTerm={setTerm}
      onSelect={selectSurah}
      searchInputRef={inputRef}
      handleKeyDown={handleKeyDown}
    />
  );
}
