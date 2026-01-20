'use client';

import React from 'react';

import { ResourceItem } from '@/app/shared/resource-panel';
import { TafsirResource } from '@/types';

export interface TafsirListProps {
  activeFilter: string;
  sectionsToRender: Array<{ language: string; items: TafsirResource[] }>;
  resources: TafsirResource[];
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
  height: number;
  total: number;
}

const renderTafsirItem = (
  item: TafsirResource,
  selectedIds: Set<number>,
  onToggle: (id: number) => void
): React.JSX.Element => (
  <ResourceItem
    key={item.id}
    item={item}
    isSelected={selectedIds.has(item.id)}
    onToggle={(id) => onToggle(id as number)}
  />
);

export const TafsirList = ({
  activeFilter,
  sectionsToRender,
  resources,
  selectedIds,
  onToggle,
  total,
}: TafsirListProps): React.JSX.Element => (
  <div className="px-4 pb-4 pt-4">
    {resources.length > 0 ? (
      activeFilter === 'All' ? (
        <div className="space-y-6">
          {sectionsToRender.map(({ language, items }) => (
            <div key={language}>
              <h3 className="text-lg font-semibold mb-4 text-foreground">{language}</h3>
              <div className="space-y-2">
                {items.map((item) => renderTafsirItem(item, selectedIds, onToggle))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {resources.map((item) => renderTafsirItem(item, selectedIds, onToggle))}
        </div>
      )
    ) : (
      <div className="text-center text-muted py-8">
        {total === 0
          ? 'Loading tafsir resources...'
          : 'No tafsir resources found for the selected filter.'}
      </div>
    )}
  </div>
);
