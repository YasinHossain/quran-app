'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';

import { ChevronDownIcon } from '@/app/shared/icons';
import { cn } from '@/lib/utils/cn';
import { Chapter } from '@/types';

import {
  buildButtonClasses,
  buildIconClasses,
  renderSelectedContent,
} from './surah-selector.helpers';
import { SurahDropdown } from './SurahDropdown';

interface SurahSelectorProps {
  chapters: Chapter[];
  value?: number;
  onChange: (surahId: number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
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
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selected = chapters.find((c) => c.id === value);

  const closeDropdown = useCallback(() => {
    setOpen(false);
    setTerm('');
  }, []);

  const toggleOpen = useCallback(() => {
    if (!disabled) setOpen((prev) => !prev);
  }, [disabled]);

  useEffect(() => {
    if (!open) return;

    const handleClick = (e: MouseEvent): void => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClick);
    const timer = setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [open, closeDropdown]);

  const selectSurah = useCallback(
    (c: Chapter): void => {
      onChange(c.id);
      closeDropdown();
    },
    [onChange, closeDropdown]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent): void => {
      if (e.key === 'Escape') {
        closeDropdown();
      }
    },
    [closeDropdown]
  );

  return (
    <div className={cn('relative', className)} ref={ref}>
      <button
        type="button"
        id={id}
        onClick={toggleOpen}
        disabled={disabled}
        className={buildButtonClasses(disabled, open)}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {renderSelectedContent(selected, placeholder)}
        </div>
        <ChevronDownIcon size={18} className={buildIconClasses(open)} />
      </button>
      {open && (
        <SurahDropdown
          chapters={chapters}
          value={value}
          searchTerm={term}
          setSearchTerm={setTerm}
          onSelect={selectSurah}
          searchInputRef={inputRef}
          handleKeyDown={handleKeyDown}
        />
      )}
    </div>
  );
};
