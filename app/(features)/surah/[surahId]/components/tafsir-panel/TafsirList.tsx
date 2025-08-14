'use client';

import React from 'react';
import { Tafsir } from './tafsirPanel.utils';
import { TafsirItem } from './TafsirItem';

interface TafsirListProps {
  activeFilter: string;
  languages: string[];
  groupedTafsirs: Record<string, Tafsir[]>;
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
  theme: string;
}

export const TafsirList: React.FC<TafsirListProps> = ({
  activeFilter,
  languages,
  groupedTafsirs,
  selectedIds,
  onToggle,
  theme,
}) => {
  if (activeFilter === 'All') {
    return (
      <div className="space-y-4">
        {languages.slice(1).map((lang) => {
          const items = groupedTafsirs[lang] || [];
          if (items.length === 0) return null;
          return (
            <div key={lang} className="lang-section" data-lang={lang}>
              <h3
                className={`lang-header text-lg font-bold pb-2 ${
                  theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                }`}
                data-lang={lang}
              >
                {lang}
              </h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <TafsirItem
                    key={item.id}
                    item={item}
                    isSelected={selectedIds.has(item.id)}
                    onToggle={onToggle}
                    theme={theme}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {(groupedTafsirs[activeFilter] || []).map((item) => (
        <TafsirItem
          key={item.id}
          item={item}
          isSelected={selectedIds.has(item.id)}
          onToggle={onToggle}
          theme={theme}
        />
      ))}
    </div>
  );
};
