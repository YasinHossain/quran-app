'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Check, GripVertical, Moon, Search, Sun } from 'lucide-react';

export type Translation = {
  id: number;
  name: string;
  author: string;
  language: string;
  selected?: boolean;
};

const initialTranslationsData: Translation[] = [
  {
    id: 1,
    name: 'Saheeh International',
    author: 'Saheeh International',
    language: 'English',
    selected: true,
  },
  {
    id: 2,
    name: 'Yusuf Ali',
    author: 'Abdullah Yusuf Ali',
    language: 'English',
  },
  {
    id: 3,
    name: 'Bengali Translator A',
    author: 'Author A',
    language: 'Bengali',
  },
  {
    id: 4,
    name: 'Bengali Translator B',
    author: 'Author B',
    language: 'Bengali',
  },
  {
    id: 5,
    name: 'Albanian Translator A',
    author: 'Author C',
    language: 'Albanian',
  },
  {
    id: 6,
    name: 'Albanian Translator B',
    author: 'Author D',
    language: 'Albanian',
  },
];

const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark =
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = useCallback(() => {
    const newValue = !isDarkMode;
    document.documentElement.classList.toggle('dark', newValue);
    localStorage.setItem('theme', newValue ? 'dark' : 'light');
    setIsDarkMode(newValue);
  }, [isDarkMode]);

  return { isDarkMode, toggleDarkMode };
};

export default function TranslationManager() {
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

  const containerRef = useRef<HTMLDivElement>(null);
  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isUserClickRef = useRef(false);

  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const filteredTranslations = useMemo(() => {
    return translations.filter((t) => {
      const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === 'All' || t.language === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [translations, searchTerm, activeFilter]);

  const groupedTranslations = useMemo(() => {
    const groups: Record<string, Translation[]> = {};
    filteredTranslations.forEach((t) => {
      if (!groups[t.language]) groups[t.language] = [];
      groups[t.language].push(t);
    });
    return groups;
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: number) => {
    e.preventDefault();
    if (draggedId === null) return;
    const newOrderedSelection = [...orderedSelection];
    const draggedIndex = newOrderedSelection.indexOf(draggedId);
    const targetIndex = newOrderedSelection.indexOf(targetId);

    const [draggedItem] = newOrderedSelection.splice(draggedIndex, 1);
    newOrderedSelection.splice(targetIndex, 0, draggedItem);

    setOrderedSelection(newOrderedSelection);
    setDraggedId(null);
  };

  const setupScrollObserver = useCallback(() => {
    observerRef.current?.disconnect();
    if (activeFilter !== 'All') return;
    if (!filteredTranslations.length) return;

    if (!stickyHeaderRef.current) return;
    const stickyHeaderHeight = stickyHeaderRef.current.offsetHeight;
    const topMargin = Math.floor(-stickyHeaderHeight);
    const bottomMargin = Math.floor(-(window.innerHeight - stickyHeaderHeight - 1));

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (isUserClickRef.current) return;
        let activeSection: Element | null = null;
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

    const sections = containerRef.current?.querySelectorAll('.lang-section');
    sections?.forEach((section) => observerRef.current?.observe(section));

    return () => observerRef.current?.disconnect();
  }, [activeFilter, filteredTranslations]);

  useEffect(() => {
    const disconnect = setupScrollObserver();
    return () => disconnect && disconnect();
  }, [setupScrollObserver]);

  const handleTabClick = (lang: string) => {
    isUserClickRef.current = true;
    setActiveFilter(lang);
    if (lang !== 'All') {
      const section = containerRef.current?.querySelector(`[data-lang="${lang}"]`);
      section?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0 });
    }
    setTimeout(() => {
      isUserClickRef.current = false;
    }, 500);
  };

  const selectedTranslations = orderedSelection
    .map((id) => translations.find((t) => t.id === id))
    .filter(Boolean) as Translation[];

  return (
    <div
      ref={containerRef}
      className="mx-auto max-w-md rounded-lg bg-white shadow dark:bg-slate-900"
    >
      <header className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">
        <button aria-label="Back">
          <ArrowLeft className="text-slate-800 dark:text-slate-200" />
        </button>
        <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Translations</h1>
        <button onClick={toggleDarkMode} aria-label="Toggle theme">
          {isDarkMode ? (
            <Sun className="text-slate-800 dark:text-slate-200" />
          ) : (
            <Moon className="text-slate-800 dark:text-slate-200" />
          )}
        </button>
      </header>

      <div className="p-4">
        {selectedTranslations.length > 0 && (
          <div className="mb-4">
            <h2 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              My Selections
            </h2>
            <div className="space-y-2">
              {selectedTranslations.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800"
                  draggable
                  onDragStart={() => setDraggedId(t.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, t.id)}
                  onDragEnd={() => setDraggedId(null)}
                >
                  <div className="flex items-center space-x-2">
                    <GripVertical className="text-slate-500" />
                    <span className="text-sm text-slate-800 dark:text-slate-200">{t.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4 flex items-center rounded border border-slate-200 px-2 dark:border-slate-700">
          <Search className="text-slate-500" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent p-2 text-sm text-slate-800 focus:outline-none dark:text-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div
        ref={stickyHeaderRef}
        className="sticky top-0 z-10 border-b border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900"
      >
        <div className="flex space-x-4 overflow-x-auto">
          {['All', 'English', 'Bengali', 'Albanian'].map((lang) => (
            <button
              key={lang}
              className={`pb-2 text-sm font-medium ${
                activeFilter === lang
                  ? 'border-b-2 border-slate-800 text-slate-800 dark:border-slate-200 dark:text-slate-200'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
              onClick={() => handleTabClick(lang)}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {Object.entries(groupedTranslations).map(([lang, items]) => (
          <div key={lang} className="mb-6 lang-section" data-lang={lang}>
            {activeFilter === 'All' && (
              <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                {lang}
              </h3>
            )}
            <div className="space-y-2">
              {items.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  className={`flex w-full cursor-pointer items-center justify-between rounded border border-slate-200 p-3 text-left dark:border-slate-700 ${
                    selectedIds.has(t.id)
                      ? 'bg-slate-100 dark:bg-slate-800'
                      : 'bg-white dark:bg-slate-900'
                  }`}
                  onClick={() => handleSelectionToggle(t.id)}
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {t.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.author}</p>
                  </div>
                  {selectedIds.has(t.id) && (
                    <Check className="text-slate-800 dark:text-slate-200" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
