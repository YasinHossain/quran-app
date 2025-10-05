'use client';

import { ResourceItem } from '@/app/shared/resource-panel';

import type { TranslationResource } from '@/types';

interface TranslationsByLanguageProps {
  sectionsToRender: Array<{ language: string; items: TranslationResource[] }>;
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
}

const renderTranslationItem = (
  item: TranslationResource,
  selectedIds: Set<number>,
  onToggle: (id: number) => void
): React.JSX.Element => (
  <ResourceItem
    key={item.id}
    item={item}
    isSelected={selectedIds.has(item.id)}
    onToggle={onToggle}
  />
);

export function TranslationsByLanguage({
  sectionsToRender,
  selectedIds,
  onToggle,
}: TranslationsByLanguageProps): React.JSX.Element {
  return (
    <div className="space-y-6">
      {sectionsToRender.map(({ language, items }) => (
        <div key={language}>
          <h3 className="text-lg font-semibold mb-4 text-foreground">{language}</h3>
          <div className="space-y-2">
            {items.map((item) => renderTranslationItem(item, selectedIds, onToggle))}
          </div>
        </div>
      ))}
    </div>
  );
}
