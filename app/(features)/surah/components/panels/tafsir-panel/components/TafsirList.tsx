'use client';

import React from 'react';

import { ResourceItem } from '@/app/shared/resource-panel';
import { TafsirResource } from '@/types';

export interface TafsirListProps {
  resources: TafsirResource[];
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
  height: number;
  total: number;
}

export const TafsirList = ({
  resources,
  selectedIds,
  onToggle,
  total,
}: TafsirListProps): React.JSX.Element => (
  <div className="px-4 pb-4 pt-4">
    {resources.length > 0 ? (
      <div className="space-y-2">
        {resources.map((resource) => (
          <ResourceItem
            key={resource.id}
            item={resource}
            isSelected={selectedIds.has(resource.id)}
            onToggle={(id) => onToggle(id as number)}
          />
        ))}
      </div>
    ) : (
      <div className="text-center text-muted py-8">
        {total === 0
          ? 'Loading tafsir resources...'
          : 'No tafsir resources found for the selected filter.'}
      </div>
    )}
  </div>
);
