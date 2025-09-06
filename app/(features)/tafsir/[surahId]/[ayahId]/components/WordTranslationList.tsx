'use client';

import { useSettings } from '@/app/providers/SettingsContext';
import { LANGUAGE_CODES } from '@/lib/text/languageCodes';

import type { LanguageCode } from '@/lib/text/languageCodes';
import type { LanguageOption } from './useWordTranslationSearch';

interface WordTranslationListProps {
  languages: LanguageOption[];
  onSelect: () => void;
}

export const WordTranslationList = ({ languages, onSelect }: WordTranslationListProps) => {
  const { settings, setSettings } = useSettings();

  const handleSelect = (lang: LanguageOption) => {
    setSettings({
      ...settings,
      wordLang:
        (LANGUAGE_CODES as Record<string, LanguageCode>)[lang.name.toLowerCase()] ??
        settings.wordLang,
      wordTranslationId: lang.id,
    });
    onSelect();
  };

  return (
    <>
      {languages.map((lang) => {
        const isSelected =
          settings.wordLang ===
          (LANGUAGE_CODES as Record<string, LanguageCode>)[lang.name.toLowerCase()];
        return (
          <div
            key={lang.id}
            role="button"
            tabIndex={0}
            onClick={() => handleSelect(lang)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelect(lang);
              }
            }}
            className={`flex items-center justify-between px-4 py-2.5 min-h-touch rounded-lg cursor-pointer transition-all duration-200 focus:outline-none focus-visible:outline-none outline-none border-0 focus:border-0 active:outline-none ${
              isSelected
                ? 'bg-accent/20 border border-accent/30'
                : 'bg-surface border border-border hover:bg-interactive'
            }`}
          >
            <div className="flex-1 min-w-0 pr-3">
              <p
                className={`font-medium text-sm leading-tight truncate ${
                  isSelected ? 'text-accent' : 'text-foreground'
                }`}
                title={lang.name}
              >
                {lang.name}
              </p>
            </div>
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
              {isSelected && (
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
      })}
    </>
  );
};
