'use client';

import React from 'react';

import { ResourceItem } from '@/app/shared/resource-panel/ResourceItem';

import type { LanguageCode } from '@/lib/text/languageCodes';

export interface WordLanguage {
  id: number;
  name: string;
  code: LanguageCode;
}

const WORD_LANGUAGES: readonly WordLanguage[] = [
  { id: 85, name: 'English', code: 'en' },
  { id: 13, name: 'Bangla', code: 'bn' },
  { id: 54, name: 'Urdu', code: 'ur' },
  { id: 158, name: 'Hindi', code: 'hi' },
  { id: 45, name: 'Bahasa Indonesia', code: 'id' },
  { id: 46, name: 'Persian', code: 'fa' },
  { id: 38, name: 'Turkish', code: 'tr' },
  { id: 50, name: 'Tamil', code: 'ta' },
];

interface LanguageListProps {
  selectedId: number;
  onSelect: (language: WordLanguage) => void;
}

export function LanguageList({ selectedId, onSelect }: LanguageListProps): React.JSX.Element {
  return (
    <div className="space-y-2">
      {WORD_LANGUAGES.map((language) => (
        <React.Fragment key={language.id}>
          <ResourceItem
            item={{ ...language, lang: language.code }}
            isSelected={selectedId === language.id}
            onToggle={() => onSelect(language)}
          />
        </React.Fragment>
      ))}
    </div>
  );
}

export default LanguageList;
