import React from 'react';
import { Translation } from './translationPanel.types';
import { TranslationItem } from './TranslationItem';

interface TranslationListProps {
  languages: string[];
  groupedTranslations: Record<string, Translation[]>;
  activeFilter: string;
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
  theme: string;
}

export const TranslationList: React.FC<TranslationListProps> = ({
  languages,
  groupedTranslations,
  activeFilter,
  selectedIds,
  onToggle,
  theme,
}) => {
  if (activeFilter === 'All') {
    return (
      <div className="space-y-4">
        {languages.slice(1).map((lang) => {
          const items = groupedTranslations[lang] || [];
          if (items.length === 0) return null;
          return (
            <div key={lang} className="space-y-2">
              <h3
                className={`text-lg font-bold pb-2 ${
                  theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                }`}
              >
                {lang}
              </h3>
              {items.map((item) => (
                <TranslationItem
                  key={item.id}
                  item={item}
                  isSelected={selectedIds.has(item.id)}
                  onToggle={onToggle}
                  theme={theme}
                />
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {(groupedTranslations[activeFilter] || []).map((item) => (
        <TranslationItem
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
