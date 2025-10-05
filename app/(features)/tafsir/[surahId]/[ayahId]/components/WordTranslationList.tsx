'use client';

import { useSettings } from '@/app/providers/SettingsContext';
import { toLanguageCode } from '@/lib/text/languageCodes';

import type { LanguageOption } from './useWordTranslationSearch';
import type { JSX } from 'react';

interface WordTranslationListProps {
  languages: LanguageOption[];
  onSelect: () => void;
}

// Helpers
const isSelectedLang = (current: string, lang: LanguageOption): boolean => {
  const currentCode = toLanguageCode(current);
  const optionCode = toLanguageCode(lang.name);
  return Boolean(currentCode && optionCode && currentCode === optionCode);
};

const applySelection = (
  settings: ReturnType<typeof useSettings>['settings'],
  setSettings: ReturnType<typeof useSettings>['setSettings'],
  lang: LanguageOption
): void => {
  const nextCode = toLanguageCode(lang.name);
  setSettings({
    ...settings,
    wordLang: nextCode ?? settings.wordLang,
    wordTranslationId: lang.id,
  });
};

interface WordLanguageItemProps {
  lang: LanguageOption;
  selected: boolean;
  onActivate: () => void;
}

const WordLanguageItem = ({ lang, selected, onActivate }: WordLanguageItemProps): JSX.Element => (
  <div
    role="button"
    tabIndex={0}
    onClick={onActivate}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onActivate();
      }
    }}
    className={`flex items-center justify-between px-4 py-2.5 min-h-touch rounded-lg cursor-pointer transition-all duration-200 focus:outline-none focus-visible:outline-none outline-none border-0 focus:border-0 active:outline-none ${
      selected
        ? 'bg-accent/20 border border-accent/30'
        : 'bg-surface border border-border hover:bg-interactive'
    }`}
  >
    <div className="flex-1 min-w-0 pr-3">
      <p
        className={`font-medium text-sm leading-tight truncate ${selected ? 'text-accent' : 'text-foreground'}`}
        title={lang.name}
      >
        {lang.name}
      </p>
    </div>
    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
      {selected && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-accent"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </div>
  </div>
);

export const WordTranslationList = ({
  languages,
  onSelect,
}: WordTranslationListProps): JSX.Element => {
  const { settings, setSettings } = useSettings();

  const handleSelect = (lang: LanguageOption): void => {
    applySelection(settings, setSettings, lang);
    onSelect();
  };

  return (
    <>
      {languages.map((lang) => (
        <WordLanguageItem
          key={lang.id}
          lang={lang}
          selected={isSelectedLang(settings.wordLang, lang)}
          onActivate={() => handleSelect(lang)}
        />
      ))}
    </>
  );
};
