'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Chapter } from '@/types';
import { ChevronDownIcon } from '@/app/shared/icons';

interface SurahSelectorProps {
  chapters: Chapter[];
  value?: number;
  onChange: (surahId: number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const SurahSelector: React.FC<SurahSelectorProps> = ({
  chapters,
  value,
  onChange,
  placeholder = 'Select Surah',
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedChapter = chapters.find((chapter) => chapter.id === value);

  // Filter chapters based on search term
  const filteredChapters = chapters.filter(
    (chapter) =>
      chapter.name_simple.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chapter.name_arabic.includes(searchTerm) ||
      chapter.id.toString().includes(searchTerm)
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus search input when dropdown opens
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (chapter: Chapter) => {
    onChange(chapter.id);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-4 py-3.5 
          bg-surface border border-border rounded-xl 
          text-left text-foreground placeholder-muted
          transition-all duration-200 shadow-sm
          ${
            !disabled
              ? 'hover:shadow-md hover:border-accent/20 focus:border-accent focus:ring-4 focus:ring-accent/10 focus:outline-none'
              : 'opacity-50 cursor-not-allowed'
          }
          ${isOpen ? 'border-accent ring-4 ring-accent/10' : ''}
        `}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {selectedChapter ? (
            <>
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-accent">{selectedChapter.id}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-foreground truncate">
                  {selectedChapter.name_simple}
                </div>
                <div className="text-xs text-muted truncate">{selectedChapter.name_arabic}</div>
              </div>
            </>
          ) : (
            <span className="text-muted">{placeholder}</span>
          )}
        </div>
        <ChevronDownIcon
          size={18}
          className={`text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-surface border border-border rounded-xl shadow-xl max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-border">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search surahs..."
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/10 focus:outline-none text-foreground placeholder-muted"
            />
          </div>

          {/* Options List */}
          <div className="overflow-y-auto max-h-64">
            {filteredChapters.length > 0 ? (
              filteredChapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => handleSelect(chapter)}
                  className={`
                    w-full flex items-center gap-3 p-3 text-left
                    hover:bg-accent/5 transition-colors duration-150
                    ${value === chapter.id ? 'bg-accent/10' : ''}
                  `}
                >
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-accent">{chapter.id}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-foreground truncate">
                      {chapter.name_simple}
                    </div>
                    <div className="text-xs text-muted truncate flex items-center gap-2">
                      <span>{chapter.name_arabic}</span>
                      <span className="w-1 h-1 bg-muted rounded-full"></span>
                      <span>{chapter.verses_count} verses</span>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-muted text-sm">
                No surahs found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
