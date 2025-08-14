'use client';
import { ArrowLeftIcon, SearchSolidIcon } from '@/app/shared/icons';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { TranslationResource } from '@/types';
import { useSettings } from '@/app/providers/SettingsContext';
import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';

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

  const allTranslations = useMemo(
    () => Object.values(groupedTranslations).flat(),
    [groupedTranslations]
  );
  const selectedTranslation = allTranslations.find((t) => t.id === settings.translationId);

  const languages = ['All', ...sortedLanguages];
  const [activeLang, setActiveLang] = useState('All');

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
            <ArrowLeftIcon size={18} />
          </button>
          <h2 className="font-bold text-lg text-[var(--foreground)]">
            {t('translations_panel_title')}
          </h2>
          <div className="w-8"></div>
        </div>
        <div className="px-4 py-3 border-b border-gray-200/80">
          <h3 className="text-xs font-semibold text-gray-500 mb-2">{t('my_selections')}</h3>
          <div className="space-y-2 min-h-[40px] bg-gray-100 dark:bg-gray-800/50 rounded-lg p-2">
            {selectedTranslation ? (
              <div className="p-2 bg-white dark:bg-gray-700 rounded-md text-sm text-[var(--foreground)]">
                {selectedTranslation.name}
              </div>
            ) : (
              <p className="text-center text-sm text-gray-400">{t('no_translations_selected')}</p>
            )}
          </div>
        </div>
        <div className="p-3 border-b border-gray-200/80">
          <div className="relative">
            <SearchSolidIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('search')}
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-[var(--background)] text-[var(--foreground)]"
            />
          </div>
        </div>
        <div className="sticky top-0 z-10 bg-[var(--background)] px-4 pt-2 pb-1 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`flex-shrink-0 px-3 py-1.5 text-sm font-semibold border-b-2 transition-colors ${
                  activeLang === lang
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-grow overflow-y-auto px-4 pb-4">
          {activeLang === 'All'
            ? sortedLanguages.map((lang) => (
                <div key={lang}>
                  <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 py-2">
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </h3>
                  <div className="space-y-1">
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
              ))
            : (groupedTranslations[activeLang] || []).map((opt) => (
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
    </>
  );
};
