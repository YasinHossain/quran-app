'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/app/providers/SettingsContext';
import type { LanguageCode } from '@/lib/text/languageCodes';
import { useTheme } from '@/app/providers/ThemeContext';
import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';

interface WordLanguagePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Simple predefined list of working word-by-word languages
const WORD_LANGUAGES = [
  { id: 85, name: 'English', code: 'en' as LanguageCode },
  { id: 13, name: 'Bangla', code: 'bn' as LanguageCode },
  { id: 54, name: 'Urdu', code: 'ur' as LanguageCode },
  { id: 45, name: 'Indonesian', code: 'id' as LanguageCode },
  { id: 38, name: 'Turkish', code: 'tr' as LanguageCode },
];

export const WordLanguagePanel: React.FC<WordLanguagePanelProps> = ({ isOpen, onClose }) => {
  const { settings, setSettings } = useSettings();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { isHidden } = useHeaderVisibility();

  const handleLanguageSelect = (language: (typeof WORD_LANGUAGES)[0]) => {
    setSettings({
      ...settings,
      wordLang: language.code,
      wordTranslationId: language.id,
    });
    onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-transparent z-30 lg:hidden ${isOpen ? '' : 'hidden'}`}
        role="button"
        tabIndex={0}
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
            onClose();
          }
        }}
      />
      <aside
        className={`fixed lg:static top-16 lg:top-0 bottom-0 right-0 w-[20.7rem] bg-[var(--background)] text-[var(--foreground)] flex-col flex-shrink-0 overflow-y-auto overflow-x-hidden shadow-[-5px_0px_15px_-5px_rgba(0,0,0,0.05)] transition-all duration-300 z-50 lg:z-40 lg:h-full ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } ${isOpen ? 'flex' : 'hidden'} lg:flex scrollbar-hide`}
        style={{
          position: 'relative',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        <header className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
          <button
            aria-label="Back"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${theme === 'dark' ? 'text-[var(--foreground)]' : 'text-slate-600'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="flex-grow text-center text-lg font-bold">
            {t('word_by_word_panel_title')}
          </h2>
          <div className="w-8" />
        </header>

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
                        ? 'bg-blue-900/30'
                        : 'bg-blue-50'
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
                            ? 'text-blue-200'
                            : 'text-blue-800'
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
                        className={`h-5 w-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4">
          <button
            onClick={() => {
              setSettings({
                ...settings,
                wordLang: 'en' as LanguageCode,
                wordTranslationId: 85, // Default to English
              });
              onClose();
            }}
            className="w-full py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm hover:border-teal-500 transition-colors"
          >
            {t('reset')}
          </button>
        </div>
      </aside>
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
