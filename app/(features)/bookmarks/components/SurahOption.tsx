import React from 'react';

import { Chapter } from '@/types';

interface SurahOptionProps {
  chapter: Chapter;
  selected: boolean;
  onSelect: (chapter: Chapter) => void;
}

export const SurahOption = ({
  chapter,
  selected,
  onSelect,
}: SurahOptionProps): React.JSX.Element => (
  <button
    onClick={() => onSelect(chapter)}
    className={`w-full flex items-center gap-3 p-3 text-left hover:bg-accent/5 transition-colors duration-150 ${selected ? 'bg-accent/10' : ''}`}
  >
    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
      <span className="text-xs font-semibold text-accent">{chapter.id}</span>
    </div>
    <div className="min-w-0 flex-1">
      <div className="text-sm font-semibold text-foreground truncate">{chapter.name_simple}</div>
      <div className="text-xs text-muted truncate flex items-center gap-2">
        <span>{chapter.name_arabic}</span>
        <span className="w-1 h-1 bg-muted rounded-full"></span>
        <span>{chapter.verses_count} verses</span>
      </div>
    </div>
  </button>
);
