'use client';

import React from 'react';

import { TranslationsByLanguage } from './TranslationsByLanguage';
import { TranslationsVirtualList } from './TranslationsVirtualList';

import type { TranslationResource } from '@/types';

interface TranslationResultsSectionProps {
  activeFilter: string;
  sectionsToRender: Array<{ language: string; items: TranslationResource[] }>;
  resourcesToRender: TranslationResource[];
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
  listHeight: number;
}

export function TranslationResultsSection(
  props: TranslationResultsSectionProps
): React.JSX.Element {
  return (
    <div className="px-4 pb-4 pt-4">
      {props.activeFilter === 'All' ? (
        <TranslationsByLanguage
          sectionsToRender={props.sectionsToRender}
          selectedIds={props.selectedIds}
          onToggle={props.onToggle}
        />
      ) : (
        <TranslationsVirtualList
          resources={props.resourcesToRender}
          selectedIds={props.selectedIds}
          onToggle={props.onToggle}
          height={props.listHeight}
        />
      )}
    </div>
  );
}
