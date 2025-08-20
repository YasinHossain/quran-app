'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/app/providers/SettingsContext';
import type { LanguageCode } from '@/lib/text/languageCodes';

interface WordLanguagePanelProps {
  isOpen: boolean;
  onClose: () => void;
  renderMode?: 'panel' | 'content'; // 'panel' for slide-over, 'content' for inline in sidebar
}

// Full list of available word-by-word languages based on WORD_LANGUAGE_LABELS
const WORD_LANGUAGES = [
  { id: 85, name: 'English', code: 'en' as LanguageCode },
  { id: 13, name: 'Bangla', code: 'bn' as LanguageCode },
  { id: 54, name: 'Urdu', code: 'ur' as LanguageCode },
  { id: 158, name: 'Hindi', code: 'hi' as LanguageCode },
  { id: 45, name: 'Bahasa Indonesia', code: 'id' as LanguageCode },
  { id: 46, name: 'Persian', code: 'fa' as LanguageCode },
  { id: 38, name: 'Turkish', code: 'tr' as LanguageCode },
  { id: 50, name: 'Tamil', code: 'ta' as LanguageCode },
];

export const WordLanguagePanel: React.FC<WordLanguagePanelProps> = ({
  isOpen,
  onClose,
  renderMode = 'panel',
}) => {
  const { settings, setSettings } = useSettings();
  const { t } = useTranslation();

  const handleLanguageSelect = (language: (typeof WORD_LANGUAGES)[0]) => {
    setSettings({
      ...settings,
      wordLang: language.code,
      wordTranslationId: language.id,
    });
  };

  const renderLanguageList = () => (
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
                ? 'bg-accent/20 border border-accent/30'
                : 'bg-surface border border-border hover:bg-interactive'
            }`}
          >
            <div className="flex-1 min-w-0 pr-3">
              <p
                className={`font-medium text-sm leading-tight truncate ${
                  isSelected ? 'text-accent' : 'text-foreground'
                }`}
                title={language.name}
              >
                {language.name}
              </p>
            </div>
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
              {isSelected && <CheckIcon className="h-5 w-5 text-accent" />}
            </div>
          </div>
        );
      })}
    </div>
  );

  // Content mode - render just the list for use inside SettingsSidebar
  if (renderMode === 'content') {
    return <div className="flex-grow p-4 space-y-4">{renderLanguageList()}</div>;
  }

  // Panel mode - render as full slide-over panel
  return (
    <div
      data-testid="word-language-panel"
      className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out z-50 shadow-lg ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } bg-background text-foreground`}
    >
      <header className="flex items-center p-4 border-b border-border">
        <button
          onClick={onClose}
          className="p-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent hover:bg-interactive-hover"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-bold text-center flex-grow text-foreground">
          {t('word_by_word_panel_title')}
        </h2>
      </header>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 pb-4 pt-4">{renderLanguageList()}</div>
        </div>
      </div>
    </div>
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
