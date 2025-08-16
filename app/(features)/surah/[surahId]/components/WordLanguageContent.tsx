'use client';

import React from 'react';
import { useSettings } from '@/app/providers/SettingsContext';
import type { LanguageCode } from '@/lib/text/languageCodes';
import { useTheme } from '@/app/providers/ThemeContext';

interface WordLanguageContentProps {
  onClose?: () => void;
}

// Simple predefined list of working word-by-word languages
const WORD_LANGUAGES = [
  { id: 85, name: 'English', code: 'en' as LanguageCode },
  { id: 13, name: 'Bangla', code: 'bn' as LanguageCode },
  { id: 54, name: 'Urdu', code: 'ur' as LanguageCode },
  { id: 45, name: 'Indonesian', code: 'id' as LanguageCode },
  { id: 38, name: 'Turkish', code: 'tr' as LanguageCode },
];

export const WordLanguageContent: React.FC<WordLanguageContentProps> = ({ onClose }) => {
  const { settings, setSettings } = useSettings();
  const { theme } = useTheme();

  const handleLanguageSelect = (language: (typeof WORD_LANGUAGES)[0]) => {
    setSettings({
      ...settings,
      wordLang: language.code,
      wordTranslationId: language.id,
    });
  };

  return (
    <>
      <div className="flex-grow p-4 space-y-4">
        <div className="space-y-2">
          {WORD_LANGUAGES.map((language) => {
            const isSelected = settings.wordTranslationId === language.id;
            return (
              <div
                key={language.id}
                role="button"
                tabIndex={0}
                onClick={() => handleLanguageSelect(language)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleLanguageSelect(language);
                  }
                }}
                className={`flex items-center justify-between px-4 py-2.5 h-[50px] rounded-lg cursor-pointer transition-all duration-200 focus:outline-none focus-visible:outline-none outline-none border-0 focus:border-0 active:outline-none ${
                  isSelected
                    ? theme === 'dark'
                      ? 'bg-emerald-900/30'
                      : 'bg-emerald-50'
                    : theme === 'dark'
                      ? 'bg-slate-700/50 hover:bg-gray-700'
                      : 'bg-white border border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="flex-1 min-w-0 pr-3">
                  <p
                    className={`font-medium text-sm leading-tight truncate ${
                      isSelected
                        ? theme === 'dark'
                          ? 'text-emerald-200'
                          : 'text-emerald-800'
                        : theme === 'dark'
                          ? 'text-[var(--foreground)]'
                          : 'text-slate-800'
                    }`}
                    title={language.name}
                  >
                    {language.name}
                  </p>
                </div>
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                  {isSelected && (
                    <CheckIcon
                      className={`h-5 w-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);