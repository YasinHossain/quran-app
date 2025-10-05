'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { Chapter } from '@/types';

interface BehaviorArgs {
  chapters: Chapter[];
  value?: number | undefined;
  onChange: (surahId: number) => void;
  disabled: boolean;
}

export interface SurahSelectorBehaviorState {
  open: boolean;
  term: string;
  setTerm: React.Dispatch<React.SetStateAction<string>>;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  toggleOpen: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  selected?: Chapter | undefined;
  selectSurah: (chapter: Chapter) => void;
  chapters: Chapter[];
  value?: number | undefined;
  closeDropdown: () => void;
}

export function useSurahSelectorBehavior({
  chapters,
  value,
  onChange,
  disabled,
}: BehaviorArgs): SurahSelectorBehaviorState {
  const visibility = useDropdownVisibility({ disabled });
  const selection = useSelectedChapter({
    chapters,
    value,
    onChange,
    close: visibility.closeDropdown,
  });

  return {
    open: visibility.open,
    term: visibility.term,
    setTerm: visibility.setTerm,
    containerRef: visibility.containerRef,
    inputRef: visibility.inputRef,
    toggleOpen: visibility.toggleOpen,
    handleKeyDown: visibility.handleKeyDown,
    selected: selection.selected,
    selectSurah: selection.selectSurah,
    chapters,
    value,
    closeDropdown: visibility.closeDropdown,
  };
}

interface DropdownVisibilityState {
  open: boolean;
  term: string;
  setTerm: React.Dispatch<React.SetStateAction<string>>;
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  toggleOpen: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  closeDropdown: () => void;
}

function useDropdownVisibility({ disabled }: { disabled: boolean }): DropdownVisibilityState {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === 'Escape') closeDropdown();
    },
    [closeDropdown]
  );

  return {
    open,
    term,
    setTerm,
    containerRef,
    inputRef,
    toggleOpen,
    handleKeyDown,
    closeDropdown,
  };
}

function useSelectedChapter({
  chapters,
  value,
  onChange,
  close,
}: {
  chapters: Chapter[];
  value?: number | undefined;
  onChange: (surahId: number) => void;
  close: () => void;
}): {
  selected?: Chapter | undefined;
  selectSurah: (chapter: Chapter) => void;
} {
  const selected = useMemo(() => chapters.find((c) => c.id === value), [chapters, value]);

  const selectSurah = useCallback(
    (c: Chapter): void => {
      onChange(c.id);
      close();
    },
    [onChange, close]
  );

  return { selected, selectSurah };
}
