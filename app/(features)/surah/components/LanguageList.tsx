'use client';

import { CheckIcon } from '@/app/shared/icons';

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
        <LanguageRow
          key={language.id}
          language={language}
          selected={selectedId === language.id}
          onSelect={() => onSelect(language)}
        />
      ))}
    </div>
  );
}

function LanguageRow({
  language,
  selected,
  onSelect,
}: {
  language: WordLanguage;
  selected: boolean;
  onSelect: () => void;
}): React.JSX.Element {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`flex items-center justify-between px-4 py-2.5 h-[50px] rounded-lg cursor-pointer transition-all duration-200 focus:outline-none focus-visible:outline-none outline-none border-0 focus:border-0 active:outline-none ${
        selected
          ? 'bg-accent/20 border border-accent/30'
          : 'bg-surface border border-border hover:bg-interactive'
      }`}
    >
      <div className="flex-1 min-w-0 pr-3">
        <p
          className={`font-medium text-sm leading-tight truncate ${selected ? 'text-accent' : 'text-foreground'}`}
          title={language.name}
        >
          {language.name}
        </p>
      </div>
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
        {selected && <CheckIcon className="h-5 w-5 text-accent" />}
      </div>
    </div>
  );
}

export default LanguageList;
