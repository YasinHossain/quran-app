'use client';
import { FaArrowLeft, FaSearch } from '@/app/components/common/SvgIcons';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/app/context/SettingsContext';
import { LANGUAGE_CODES } from '@/lib/languageCodes';
import type { LanguageCode } from '@/lib/languageCodes';

interface LanguageOption {
  name: string;
  id: number;
}

interface WordLanguagePanelProps {
  isOpen: boolean;
  onClose: () => void;
  languages: LanguageOption[];
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onReset: () => void;
}

export const WordLanguagePanel = ({
  isOpen,
  onClose,
  languages,
  searchTerm,
  onSearchTermChange,
  onReset,
}: WordLanguagePanelProps) => {
  const { settings, setSettings } = useSettings();
  const { t } = useTranslation();

  const filtered = languages.filter((lang) =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`fixed top-0 bottom-0 lg:top-16 right-0 w-[23rem] bg-[var(--background)] text-[var(--foreground)] flex flex-col transition-transform duration-300 ease-in-out z-50 shadow-lg ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200/80">
        <button
          aria-label="Back"
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          <FaArrowLeft size={18} />
        </button>
        <h2 className="font-bold text-lg text-[var(--foreground)]">
          {t('word_by_word_panel_title')}
        </h2>
        <div className="w-8"></div>
      </div>
      <div className="p-3 border-b border-gray-200/80">
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t('search')}
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-[var(--background)] text-[var(--foreground)]"
          />
        </div>
      </div>
      <div className="flex-grow overflow-y-auto">
        {filtered.map((lang) => (
          <label
            key={lang.id}
            className="flex items-center space-x-3 p-2 rounded-md hover:bg-teal-50 cursor-pointer"
          >
            <input
              type="radio"
              name="wordLanguage"
              className="form-radio h-4 w-4 text-teal-600"
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
            <span className="text-sm text-[var(--foreground)]">{lang.name}</span>
          </label>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200/80">
        <button
          onClick={() => {
            onReset();
            onClose();
          }}
          className="w-full py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm hover:border-teal-500"
        >
          {t('reset')}
        </button>
      </div>
    </div>
  );
};
