'use client';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/app/providers/SettingsContext';
import { LANGUAGE_CODES } from '@/lib/text/languageCodes';
import type { LanguageCode } from '@/lib/text/languageCodes';
import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { ArrowLeftIcon } from '@/app/shared/icons';
import { SearchInput } from '@/app/shared/components/SearchInput';

interface LanguageOption {
  name: string;
  id: number;
}

interface WordTranslationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  languages: LanguageOption[];
  onReset: () => void;
}

export const WordTranslationPanel = ({
  isOpen,
  onClose,
  languages,
  onReset,
}: WordTranslationPanelProps) => {
  const { settings, setSettings } = useSettings();
  const { t } = useTranslation();
  const { isHidden } = useHeaderVisibility();
  const [searchTerm, setSearchTerm] = useState('');

  const sortedLanguages = useMemo(
    () => [...languages].sort((a, b) => a.name.localeCompare(b.name)),
    [languages]
  );
  const filtered = useMemo(
    () =>
      sortedLanguages.filter((lang) => lang.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [sortedLanguages, searchTerm]
  );

  return (
    <div
      className={`fixed pt-safe pb-safe ${isHidden ? 'top-0' : 'top-16'} bottom-0 right-0 w-[20.7rem] bg-surface text-foreground flex flex-col transition-all duration-300 ease-in-out z-50 shadow-lg ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <button
          aria-label="Back"
          onClick={onClose}
          className="p-2 rounded-full hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <ArrowLeftIcon size={18} />
        </button>
        <h2 className="font-bold text-lg text-foreground">{t('word_by_word_panel_title')}</h2>
        <div className="w-8"></div>
      </div>
      <div className="p-3 border-b border-border">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={t('search')}
          variant="default"
          size="md"
        />
      </div>
      <div className="flex-grow overflow-y-auto">
        {filtered.map((lang) => {
          const isSelected =
            settings.wordLang ===
            (LANGUAGE_CODES as Record<string, LanguageCode>)[lang.name.toLowerCase()];
          return (
            <div
              key={lang.id}
              role="button"
              tabIndex={0}
              onClick={() => {
                setSettings({
                  ...settings,
                  wordLang:
                    (LANGUAGE_CODES as Record<string, LanguageCode>)[lang.name.toLowerCase()] ??
                    settings.wordLang,
                  wordTranslationId: lang.id,
                });
                onClose();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSettings({
                    ...settings,
                    wordLang:
                      (LANGUAGE_CODES as Record<string, LanguageCode>)[lang.name.toLowerCase()] ??
                      settings.wordLang,
                    wordTranslationId: lang.id,
                  });
                  onClose();
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
      </div>
      <div className="p-4 border-t border-border">
        <button
          onClick={() => {
            onReset();
            onClose();
          }}
          className="w-full py-2.5 rounded-lg border border-border text-sm hover:border-accent"
        >
          {t('reset')}
        </button>
      </div>
    </div>
  );
};

export default WordTranslationPanel;
