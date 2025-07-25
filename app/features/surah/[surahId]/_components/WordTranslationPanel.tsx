// app/features/surah/[surahId]/_components/WordTranslationPanel.tsx
'use client';
import { FaArrowLeft, FaSearch } from '@/app/components/common/SvgIcons';
import { useTranslation } from 'react-i18next';
import { TranslationResource } from '@/types';
import { useSettings } from '@/app/context/SettingsContext';

interface WordTranslationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  groupedTranslations: Record<string, TranslationResource[]>;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onReset: () => void;
}

export const WordTranslationPanel = ({
  isOpen,
  onClose,
  groupedTranslations,
  searchTerm,
  onSearchTermChange,
  onReset,
}: WordTranslationPanelProps) => {
  const { settings, setSettings } = useSettings();
  const { t } = useTranslation();
  return (
    <div
      className={`fixed top-0 right-0 w-80 h-full bg-[var(--background)] text-[var(--foreground)] flex flex-col transition-transform duration-300 ease-in-out z-50 shadow-lg ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
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
        {groupedTranslations &&
          Object.keys(groupedTranslations).map((lang) => (
            <div key={lang}>
              <h3 className="sticky top-0 bg-gray-100 px-4 py-2 font-bold text-teal-800 text-sm">
                {lang}
              </h3>
              <div className="p-2 space-y-1">
                {groupedTranslations[lang].map((opt) => (
                  <label
                    key={opt.id}
                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-teal-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="wordTranslation"
                      className="form-radio h-4 w-4 text-teal-600"
                      checked={settings.wordTranslationId === opt.id}
                      onChange={() => {
                        setSettings({ ...settings, wordTranslationId: opt.id });
                        onClose();
                      }}
                    />
                    <span className="text-sm text-[var(--foreground)]">{opt.name}</span>
                  </label>
                ))}
              </div>
            </div>
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
