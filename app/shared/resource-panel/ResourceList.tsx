'use client';

import React from 'react';
import { ResourceItem } from './ResourceItem';

interface Resource {
  id: number;
  name: string;
  lang: string;
}

interface ResourceListProps<T extends Resource> {
  languages: string[];
  groupedResources: Record<string, T[]>;
  activeFilter: string;
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
  theme: string;
}

export const ResourceList = <T extends Resource>({
  languages,
  groupedResources,
  activeFilter,
  selectedIds,
  onToggle,
  theme,
}: ResourceListProps<T>) => {
  if (activeFilter === 'All') {
    return (
      <div className="space-y-4">
        {languages.slice(1).map((lang) => {
          const items = groupedResources[lang] || [];
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
                  <ResourceItem
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
      {(groupedResources[activeFilter] || []).map((item) => (
        <ResourceItem
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

export default ResourceList;
