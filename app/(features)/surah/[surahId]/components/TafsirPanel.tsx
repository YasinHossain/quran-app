'use client';
import { ArrowLeftIcon, CloseIcon, SearchSolidIcon } from '@/app/shared/icons';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/app/providers/SettingsContext';
import { TafsirResource } from '@/types';
import { getTafsirResources } from '@/lib/api';
import useSWR from 'swr';
import { useMemo, useState } from 'react';
import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';

interface TafsirPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TafsirPanel = ({ isOpen, onClose }: TafsirPanelProps) => {
  const { settings, setSettings } = useSettings();
  const { t } = useTranslation();
  const { data } = useSWR('tafsirs', getTafsirResources);
  const [searchTerm, setSearchTerm] = useState('');
  const { isHidden } = useHeaderVisibility();

  const grouped = useMemo(() => {
    const filtered = (data || []).filter(
      (t) =>
        ['english', 'bengali', 'arabic'].includes(t.language_name.toLowerCase()) &&
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filtered.reduce<Record<string, TafsirResource[]>>((acc, cur) => {
      (acc[cur.language_name] ||= []).push(cur);
      return acc;
    }, {});
  }, [data, searchTerm]);

  const selectedTafsirs = useMemo(
    () => (data || []).filter((t) => settings.tafsirIds.includes(t.id)),
    [data, settings.tafsirIds]
  );

  const sortedLanguages = useMemo(() => Object.keys(grouped).sort(), [grouped]);
  const languages = ['All', ...sortedLanguages];
  const [activeLang, setActiveLang] = useState('All');

  return (
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
        <h2 className="font-bold text-lg text-[var(--foreground)]">{t('tafsir_panel_title')}</h2>
        <div className="w-8"></div>
      </div>
      <div className="px-4 py-3 border-b border-gray-200/80">
        <h3 className="text-xs font-semibold text-gray-500 mb-2">{t('my_selections')}</h3>
        <div className="space-y-2 min-h-[40px] bg-gray-100 dark:bg-gray-800/50 rounded-lg p-2">
          {selectedTafsirs.length > 0 ? (
            selectedTafsirs.map((opt) => (
              <div
                key={opt.id}
                className="flex items-center justify-between bg-white dark:bg-gray-700 p-2 rounded-md text-sm text-[var(--foreground)]"
              >
                <span className="truncate">{opt.name}</span>
                <button
                  onClick={() =>
                    setSettings({
                      ...settings,
                      tafsirIds: settings.tafsirIds.filter((id) => id !== opt.id),
                    })
                  }
                  className="p-1 text-gray-400 hover:text-red-500"
                  aria-label={t('close')}
                >
                  <CloseIcon size={14} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-gray-400">{t('no_tafsirs_selected')}</p>
          )}
        </div>
      </div>
      <div className="p-3 border-b border-gray-200/80">
        <div className="relative">
          <SearchSolidIcon
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder={t('search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all duration-300 hover:shadow-lg hover:ring-1 hover:ring-teal-600 bg-[var(--background)] text-[var(--foreground)] border border-gray-200 dark:border-gray-600 placeholder-gray-400"
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
          ? languages.slice(1).map((lang) => (
              <div key={lang}>
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 py-2">{lang}</h3>
                <div className="space-y-1">
                  {(grouped[lang] || []).map((opt) => (
                    <label
                      key={opt.id}
                      className="flex items-center space-x-3 p-2 rounded-md hover:bg-teal-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-teal-600"
                        checked={settings.tafsirIds.includes(opt.id)}
                        onChange={() => {
                          const exists = settings.tafsirIds.includes(opt.id);
                          const ids = exists
                            ? settings.tafsirIds.filter((id) => id !== opt.id)
                            : settings.tafsirIds.length < 3
                              ? [...settings.tafsirIds, opt.id]
                              : settings.tafsirIds;
                          setSettings({ ...settings, tafsirIds: ids });
                        }}
                      />
                      <span className="text-sm text-[var(--foreground)]">{opt.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))
          : (grouped[activeLang] || []).map((opt) => (
              <label
                key={opt.id}
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-teal-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-teal-600"
                  checked={settings.tafsirIds.includes(opt.id)}
                  onChange={() => {
                    const exists = settings.tafsirIds.includes(opt.id);
                    const ids = exists
                      ? settings.tafsirIds.filter((id) => id !== opt.id)
                      : settings.tafsirIds.length < 3
                        ? [...settings.tafsirIds, opt.id]
                        : settings.tafsirIds;
                    setSettings({ ...settings, tafsirIds: ids });
                  }}
                />
                <span className="text-sm text-[var(--foreground)]">{opt.name}</span>
              </label>
            ))}
      </div>
    </div>
  );
};
