'use client';
import { FaArrowLeft, FaSearch } from '@/app/components/common/SvgIcons';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { TranslationResource } from '@/types';
import { useSettings } from '@/app/context/SettingsContext';
import { useHeaderVisibility } from '@/app/context/HeaderVisibilityContext';

interface TranslationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  groupedTranslations: Record<string, TranslationResource[]>;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

export const TranslationPanel = ({
  isOpen,
  onClose,
  groupedTranslations,
  searchTerm,
  onSearchTermChange,
}: TranslationPanelProps) => {
  const { settings, setSettings } = useSettings();
  const { t } = useTranslation();
  const { isHidden } = useHeaderVisibility();
  const sortedLanguages = useMemo(() => {
    return Object.keys(groupedTranslations).sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();

      const getRank = (lang: string) => {
        if (lang === 'english') return 0;
        if (lang === 'bengali' || lang === 'bangla') return 1;
        return 2;
      };

      const rankA = getRank(aLower);
      const rankB = getRank(bLower);

      if (rankA !== rankB) {
        return rankA - rankB;
      }

      return a.localeCompare(b);
    });
  }, [groupedTranslations]);

  return (
    <>
      {/* Removed the overlay div */}
      <div
        className={`fixed ${isHidden ? 'top-0' : 'top-16'} bottom-0 right-0 w-[20.7rem] bg-[var(--background)] text-[var(--foreground)] flex flex-col transition-all duration-300 ease-in-out z-50 shadow-lg ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
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
            {t('translations_panel_title')}
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
            sortedLanguages.map((lang) => (
              <div key={lang}>
                <h3 className="sticky top-0 px-4 py-2 font-bold text-gray-700 text-sm bg-gray-100 dark:bg-gray-700 dark:text-teal-300">
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </h3>
                <div className="p-2 space-y-1">
                  {groupedTranslations[lang].map((opt) => (
                    <label
                      key={opt.id}
                      className="flex items-center space-x-3 p-2 rounded-md hover:bg-teal-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="translation"
                        className="form-radio h-4 w-4 text-teal-600"
                        checked={settings.translationId === opt.id}
                        onChange={() => {
                          setSettings({ ...settings, translationId: opt.id });
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
      </div>
    </>
  );
};
