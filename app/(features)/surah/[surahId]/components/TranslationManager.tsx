'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useSettings } from '@/app/providers/SettingsContext';
import { TranslationResource } from '@/types';
import { ArrowLeftIcon } from '@/app/shared/icons/ArrowLeftIcon';
import { CheckIcon } from '@/app/shared/icons/CheckIcon';

// --- TYPE DEFINITIONS ---
interface Translation {
  id: number;
  name: string;
  lang: string;
}

interface TranslationManagerProps {
  isOpen: boolean;
  onClose: () => void;
  translations: TranslationResource[];
}

const TranslationManager: React.FC<TranslationManagerProps> = ({
  isOpen,
  onClose,
  translations: translationResources,
}) => {
  const { settings, setSettings } = useSettings();

  const mappedTranslations = useMemo(() => {
    return translationResources.map((t) => ({
      id: t.id,
      name: t.name,
      lang: t.language_name,
    }));
  }, [translationResources]);

  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isUserClickRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const languages = useMemo(
    () => ['All', ...new Set(mappedTranslations.map((t) => t.lang))],
    [mappedTranslations]
  );

  const filteredTranslations = React.useMemo(() => {
    return mappedTranslations.filter(
      (item) => searchTerm === '' || item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [mappedTranslations, searchTerm]);

  const groupedTranslations = React.useMemo(() => {
    return filteredTranslations.reduce(
      (acc, item) => {
        (acc[item.lang] = acc[item.lang] || []).push(item);
        return acc;
      },
      {} as Record<string, Translation[]>
    );
  }, [filteredTranslations]);

  const handleSelectionToggle = (id: number) => {
    setSettings((prev) => ({ ...prev, translationId: id }));
    onClose();
  };

  const handleTabClick = (lang: string) => {
    isUserClickRef.current = true;
    setActiveFilter(lang);
    const container = contentRef.current;

    if (lang === 'All') {
      container?.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const header = container?.querySelector(`.lang-header[data-lang="${lang}"]`);
      if (header && stickyHeaderRef.current && container) {
        const headerTop = (header as HTMLElement).offsetTop - stickyHeaderRef.current.offsetHeight;
        container.scrollTo({ top: headerTop, behavior: 'smooth' });
      }
    }
    setTimeout(() => {
      isUserClickRef.current = false;
    }, 800);
  };

  const setupScrollObserver = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect();

    const container = contentRef.current;
    const sections = container?.querySelectorAll('.lang-section');

    if (!sections || sections.length === 0 || !stickyHeaderRef.current || !container) return;

    const stickyHeaderHeight = stickyHeaderRef.current.offsetHeight;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (isUserClickRef.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const lang = (entry.target as HTMLElement).dataset.lang;
            if (lang) {
              setActiveFilter(lang);
            }
          }
        });
      },
      {
        root: container,
        rootMargin: `-${stickyHeaderHeight}px 0px 0px 0px`,
        threshold: 0.1,
      }
    );

    sections.forEach((section) => observerRef.current?.observe(section));
  }, []);

  useEffect(() => {
    if (activeFilter === 'All' && isOpen) {
      const timer = setTimeout(setupScrollObserver, 50);
      return () => clearTimeout(timer);
    }
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [activeFilter, groupedTranslations, setupScrollObserver, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
    <div
      className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div className="fixed inset-y-0 right-0 flex max-w-full" onClick={(e) => e.stopPropagation()}>
        <div className="w-screen max-w-md">
          <div className="flex h-full flex-col bg-white dark:bg-slate-900 shadow-xl">
            <header className="flex items-center p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close panel"
              >
                <ArrowLeftIcon size={20} className="text-slate-600 dark:text-slate-400" />
              </button>
              <h1
                id="dialog-title"
                className="text-lg font-semibold text-slate-800 dark:text-slate-200 text-center flex-grow"
              >
                Manage Translations
              </h1>
              <div className="w-8" />
            </header>

            <div ref={contentRef} className="overflow-y-auto">
              <div className="p-4 space-y-4">
                <div className="relative">
                  <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by name or style..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-transparent dark:text-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div
                ref={stickyHeaderRef}
                className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm pt-2 pb-0 border-b border-slate-200 dark:border-slate-700"
              >
                <div className="px-4">
                  <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => handleTabClick(lang)}
                        className={`flex-shrink-0 px-3 py-2 text-sm font-semibold border-b-2 transition-colors ${
                          activeFilter === lang
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="mt-4">
                  {activeFilter === 'All' ? (
                    <div className="space-y-4">
                      {Object.entries(groupedTranslations).map(([lang, items]) => (
                        <div key={lang} className="lang-section" data-lang={lang}>
                          <h3 className="lang-header text-lg font-bold text-slate-700 dark:text-slate-300 pb-2 pt-2">
                            {lang}
                          </h3>
                          <div className="space-y-2">
                            {items.map((item) => (
                              <TranslationItem
                                key={item.id}
                                item={item}
                                isSelected={settings.translationId === item.id}
                                onToggle={handleSelectionToggle}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {(groupedTranslations[activeFilter] || []).map((item) => (
                        <TranslationItem
                          key={item.id}
                          item={item}
                          isSelected={settings.translationId === item.id}
                          onToggle={handleSelectionToggle}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TranslationItemProps {
  item: Translation;
  isSelected: boolean;
  onToggle: (id: number) => void;
}

const TranslationItem: React.FC<TranslationItemProps> = ({ item, isSelected, onToggle }) => {
  return (
    <button
      onClick={() => onToggle(item.id)}
      className={`w-full text-left flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? 'bg-blue-50 dark:bg-blue-900/30'
          : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
      }`}
    >
      <p className="font-medium text-slate-800 dark:text-slate-200">{item.name}</p>
      {isSelected && <CheckIcon className="h-5 w-5 text-blue-600" />}
    </button>
  );
};

export { TranslationManager };
