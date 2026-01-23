'use client';

import React from 'react';

import { ResourceItem } from '@/app/shared/resource-panel';
import { TranslationsByLanguage } from './TranslationsByLanguage';

import type { TranslationResource } from '@/types';

interface TranslationResultsSectionProps {
  activeFilter: string;
  sectionsToRender: Array<{ language: string; items: TranslationResource[] }>;
  resourcesToRender: TranslationResource[];
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
}

export function TranslationResultsSection(
  props: TranslationResultsSectionProps
): React.JSX.Element {
  return (
    <div className="px-4 pb-4 pt-4">
      {props.resourcesToRender.length > 0 ? (
        props.activeFilter === 'All' ? (
          <TranslationsByLanguage
            sectionsToRender={props.sectionsToRender}
            selectedIds={props.selectedIds}
            onToggle={props.onToggle}
          />
        ) : (
          <div className="space-y-2">
            {props.resourcesToRender.map((item) => (
              <ResourceItem
                key={item.id}
                item={item}
                isSelected={props.selectedIds.has(item.id)}
                onToggle={(id) => props.onToggle(id as number)}
              />
            ))}
          </div>
        )
      ) : (
        <div className="text-center text-muted py-8">
          No translation resources found for the selected filter.
        </div>
      )}
    </div>
  );
}
