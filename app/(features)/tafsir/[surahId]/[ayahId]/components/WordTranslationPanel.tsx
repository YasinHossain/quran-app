'use client';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/app/providers/SettingsContext';
import { LANGUAGE_CODES } from '@/lib/text/languageCodes';
import type { LanguageCode } from '@/lib/text/languageCodes';
import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { ArrowLeftIcon, SearchIcon } from '@/app/shared/icons';

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
      className={`fixed ${isHidden ? 'top-0' : 'top-16'} bottom-0 right-0 w-[20.7rem] bg-surface text-primary flex flex-col transition-all duration-300 ease-in-out z-50 shadow-lg ${
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
        <h2 className="font-bold text-lg text-primary">{t('word_by_word_panel_title')}</h2>
        <div className="w-8"></div>
      </div>
      <div className="p-3 border-b border-border">
        <div className="relative">
          <SearchIcon
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            width={18}
            height={18}
          />
          <input
            type="text"
            placeholder={t('search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-accent outline-none bg-surface text-primary"
          />
        </div>
      </div>
      <div className="flex-grow overflow-y-auto">
        {filtered.map((lang) => (
          <label
            key={lang.id}
            className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/10 cursor-pointer"
          >
            <input
              type="radio"
              name="wordLanguage"
              className="form-radio h-4 w-4 text-accent"
              checked={
                settings.wordLang ===
                (LANGUAGE_CODES as Record<string, LanguageCode>)[lang.name.toLowerCase()]
              }
              onChange={() => {
                setSettings({
                  ...settings,
                  wordLang:
                    (LANGUAGE_CODES as Record<string, LanguageCode>)[lang.name.toLowerCase()] ??
                    settings.wordLang,
                  wordTranslationId: lang.id,
                });
                onClose();
              }}
            />
            <span className="text-sm text-primary">{lang.name}</span>
          </label>
        ))}
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
