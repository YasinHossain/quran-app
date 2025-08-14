'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sun, Moon, Search, GripVertical, X } from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface Translation {
  id: number;
  name: string;
  lang: string;
  selected: boolean;
}

// --- DUMMY DATA (EXPANDED) ---
const initialTranslationsData: Translation[] = [
  { id: 1, name: 'M.A.S. Abdel Haleem', lang: 'English', selected: false },
  { id: 2, name: "Fadel Soliman, Bridges' translation", lang: 'English', selected: false },
  { id: 3, name: 'T. Usmani', lang: 'English', selected: true },
  { id: 4, name: 'A. Maududi (Tafhim commentary)', lang: 'English', selected: true },
  { id: 5, name: 'M. Pickthall', lang: 'English', selected: false },
  { id: 6, name: 'A. Yusuf Ali', lang: 'English', selected: false },
  { id: 7, name: 'Saheeh International', lang: 'English', selected: false },
  { id: 8, name: 'Al-Hilali & Khan', lang: 'English', selected: false },
  { id: 9, name: 'Transliteration', lang: 'English', selected: false },
  { id: 10, name: 'Taisirul Quran', lang: 'Bengali', selected: false },
  { id: 11, name: 'Sheikh Mujibur Rahman', lang: 'Bengali', selected: false },
  { id: 12, name: 'Rawai Al-bayan', lang: 'Bengali', selected: false },
  { id: 13, name: 'Dr. Abu Bakr Muhammad Zakaria', lang: 'Bengali', selected: false },
  { id: 16, name: 'Modern Bengali Version', lang: 'Bengali', selected: false },
  { id: 17, name: 'Classical Bengali Notes', lang: 'Bengali', selected: false },
  { id: 18, name: 'Bengali Thematic Study', lang: 'Bengali', selected: false },
  { id: 14, name: 'Hasan Efendi Nahi', lang: 'Albanian', selected: false },
  { id: 15, name: 'Albanian', lang: 'Albanian', selected: false },
  { id: 19, name: 'New Albanian Translation', lang: 'Albanian', selected: false },
  { id: 20, name: 'Albanian Commentary', lang: 'Albanian', selected: false },
  { id: 21, name: 'Albanian Poetic Version', lang: 'Albanian', selected: false },
  { id: 22, name: 'Scholarly Albanian Edition', lang: 'Albanian', selected: false },
];

// --- HELPER HOOK FOR DARK MODE ---
const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      const isDark =
        localStorage.theme === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    checkDarkMode();
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkDarkMode);
    return () => mediaQuery.removeEventListener('change', checkDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newIsDark = !isDarkMode;
    localStorage.theme = newIsDark ? 'dark' : 'light';
    setIsDarkMode(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
  };

  return { isDarkMode, toggleDarkMode };
};

interface TranslationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// --- MAIN COMPONENT ---
export const TranslationPanel: React.FC<TranslationPanelProps> = ({ isOpen, onClose }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [translations] = useState<Translation[]>(initialTranslationsData);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(
    new Set(initialTranslationsData.filter((t) => t.selected).map((t) => t.id))
  );
  const [orderedSelection, setOrderedSelection] = useState<number[]>(
    initialTranslationsData.filter((t) => t.selected).map((t) => t.id)
  );
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedId, setDraggedId] = useState<number | null>(null);

  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  const isUserClickRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const languages = ['All', ...new Set(translations.map((t) => t.lang))];

  const filteredTranslations = React.useMemo(() => {
    return translations.filter(
      (item) => searchTerm === '' || item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [translations, searchTerm]);

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
    const newSelectedIds = new Set(selectedIds);
    let newOrderedSelection = [...orderedSelection];

    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
      newOrderedSelection = newOrderedSelection.filter((selId) => selId !== id);
    } else {
      newSelectedIds.add(id);
      newOrderedSelection.push(id);
    }
    setSelectedIds(newSelectedIds);
    setOrderedSelection(newOrderedSelection);
  };

  const handleTabClick = (lang: string) => {
    isUserClickRef.current = true;
    setActiveFilter(lang);

    if (lang === 'All') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const header = document.querySelector(`.lang-header[data-lang="${lang}"]`);
      if (header && stickyHeaderRef.current) {
        const headerTop =
          header.getBoundingClientRect().top +
          window.pageYOffset -
          stickyHeaderRef.current.offsetHeight;
        window.scrollTo({ top: headerTop, behavior: 'smooth' });
      }
    }
    setTimeout(() => {
      isUserClickRef.current = false;
    }, 800);
  };

  const setupScrollObserver = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect();

    const sections = document.querySelectorAll('.lang-section');
    if (sections.length === 0 || !stickyHeaderRef.current) return;

    const stickyHeaderHeight = stickyHeaderRef.current.offsetHeight;
    const topMargin = Math.floor(-stickyHeaderHeight);
    const bottomMargin = Math.floor(-(window.innerHeight - stickyHeaderHeight - 1));

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (isUserClickRef.current) return;

        let activeSection = null;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeSection = entry.target;
          }
        });

        if (activeSection) {
          const lang = (activeSection as HTMLElement).dataset.lang;
          if (lang && lang !== activeFilter) {
            setActiveFilter(lang);
          }
        }
      },
      {
        root: null,
        rootMargin: `${topMargin}px 0px ${bottomMargin}px 0px`,
        threshold: 0,
      }
    );

    sections.forEach((section) => observerRef.current?.observe(section));
  }, [activeFilter]);

  useEffect(() => {
    if (activeFilter === 'All') {
      setupScrollObserver();
    }
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [activeFilter, groupedTranslations, setupScrollObserver]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: number) => {
    e.preventDefault();
    if (draggedId === null || draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    const newOrderedSelection = [...orderedSelection];
    const draggedIndex = newOrderedSelection.indexOf(draggedId);
    const targetIndex = newOrderedSelection.indexOf(targetId);

    const [draggedItem] = newOrderedSelection.splice(draggedIndex, 1);
    newOrderedSelection.splice(targetIndex, 0, draggedItem);

    setOrderedSelection(newOrderedSelection);
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-start justify-center pt-12 overflow-auto">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl my-8 relative">
        <header className="flex items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-slate-600 dark:text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-200 text-center flex-grow">
            Manage Translations
          </h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </header>

        <div className="p-4 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 px-1 mb-2">
              MY SELECTIONS ({orderedSelection.length})
            </h2>
            <div className="space-y-2 min-h-[40px] bg-slate-100 dark:bg-slate-800/50 rounded-lg p-2">
              {orderedSelection.length === 0 ? (
                <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-2">
                  No translations selected
                </p>
              ) : (
                orderedSelection.map((id) => {
                  const item = translations.find((t) => t.id === id);
                  if (!item) return null;
                  return (
                    <div
                      key={id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, id)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, id)}
                      onDragEnd={handleDragEnd}
                      className={`flex items-center justify-between bg-white dark:bg-slate-700/50 p-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm cursor-grab active:cursor-grabbing transition-opacity ${draggedId === id ? 'opacity-50' : 'opacity-100'}`}
                    >
                      <div className="flex items-center min-w-0">
                        <GripVertical className="h-5 w-5 text-slate-400 dark:text-slate-500 mr-2 flex-shrink-0" />
                        <span className="font-medium text-slate-700 dark:text-slate-300 text-sm truncate">
                          {item.name}
                        </span>
                      </div>
                      <button
                        onClick={() => handleSelectionToggle(id)}
                        className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-500 transition-colors p-1 rounded-full flex-shrink-0 ml-2"
                      >
                        <X size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
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
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
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
                    <h3 className="lang-header text-lg font-bold text-slate-700 dark:text-slate-300 pb-2">
                      {lang}
                    </h3>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <TranslationItem
                          key={item.id}
                          item={item}
                          isSelected={selectedIds.has(item.id)}
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
                    isSelected={selectedIds.has(item.id)}
                    onToggle={handleSelectionToggle}
                  />
                ))}
              </div>
            )}
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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onToggle(item.id);
    }
  };

  return (
    <div
      onClick={() => onToggle(item.id)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? 'bg-blue-50 dark:bg-blue-900/30'
          : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
      }`}
    >
      <p className="font-medium text-slate-800 dark:text-slate-200">{item.name}</p>
      {isSelected && <CheckIcon className="h-5 w-5 text-blue-600" />}
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
