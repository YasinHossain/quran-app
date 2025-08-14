'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sun, Moon, Search, GripVertical, X } from 'lucide-react';

interface Translation {
  id: string;
  language: string;
  name: string;
  author: string;
}

const dummyTranslations: Translation[] = [
  { id: 'en-1', language: 'English', name: 'Saheeh International', author: 'Saheeh International' },
  { id: 'en-2', language: 'English', name: "The Message of the Qur'an", author: 'Muhammad Asad' },
  { id: 'bn-1', language: 'Bengali', name: 'Zohurul Hoque', author: 'Zohurul Hoque' },
  { id: 'bn-2', language: 'Bengali', name: 'Tawhidul Islam', author: 'Tawhidul Islam' },
  { id: 'fr-1', language: 'French', name: 'Muhammad Hamidullah', author: 'Muhammad Hamidullah' },
  { id: 'fr-2', language: 'French', name: 'Muhammad Habib', author: 'Muhammad Habib' },
  { id: 'tr-1', language: 'Turkish', name: 'Hasan Basri Çantay', author: 'Hasan Basri Çantay' },
  { id: 'tr-2', language: 'Turkish', name: 'Diyanet', author: 'Diyanet' },
  { id: 'es-1', language: 'Spanish', name: 'Julio Cortes', author: 'Julio Cortes' },
  { id: 'ur-1', language: 'Urdu', name: 'Maududi', author: 'Maududi' },
  { id: 'ar-1', language: 'Arabic', name: 'Tafsir al-Jalalayn', author: 'Jalalayn' },
];

interface TranslationManagerProps {
  isOpen?: boolean;
  onClose?: () => void;
  groupedTranslations?: Record<string, unknown>;
  searchTerm?: string;
  onSearchTermChange?: (term: string) => void;
}

const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const toggle = () => setIsDark((v) => !v);

  return { isDark, toggle };
};

export const TranslationManager = ({}: TranslationManagerProps) => {
  const [translations] = useState<Translation[]>(dummyTranslations);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [orderedSelection, setOrderedSelection] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('English');
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionsRef = useRef<Record<string, HTMLDivElement | null>>({});

  const languages = Array.from(new Set(translations.map((t) => t.language))).sort();

  const grouped = translations.reduce<Record<string, Translation[]>>((acc, t) => {
    acc[t.language] = acc[t.language] || [];
    acc[t.language].push(t);
    return acc;
  }, {});

  const handleSelectionToggle = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    setOrderedSelection((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleTabClick = (lang: string) => {
    setActiveFilter(lang);
    const el = sectionsRef.current[lang];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDragStart = (id: string) => () => {
    setDraggedId(id);
  };

  const handleDragOver = (id: string) => (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedId || draggedId === id) return;
    setOrderedSelection((prev) => {
      const from = prev.indexOf(draggedId);
      const to = prev.indexOf(id);
      if (from === -1 || to === -1) return prev;
      const next = [...prev];
      next.splice(from, 1);
      next.splice(to, 0, draggedId);
      return next;
    });
  };

  const handleDrop = () => {
    setDraggedId(null);
  };

  const setupScrollObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const lang = (entry.target as HTMLElement).dataset.lang;
            if (lang) setActiveFilter(lang);
          }
        });
      },
      { root: listRef.current, threshold: 0.1 }
    );
    languages.forEach((lang) => {
      const el = sectionsRef.current[lang];
      if (el) observerRef.current?.observe(el);
    });
  }, [languages]);

  useEffect(() => {
    setupScrollObserver();
  }, [setupScrollObserver]);

  const { isDark, toggle } = useDarkMode();

  const selectedTranslations = orderedSelection
    .map((id) => translations.find((t) => t.id === id))
    .filter(Boolean) as Translation[];

  return (
    <div className="flex h-full flex-col bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <h2 className="text-lg font-bold">Translations</h2>
        <button
          aria-label="Toggle dark mode"
          onClick={toggle}
          className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {selectedTranslations.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4">
          {selectedTranslations.map((t) => (
            <span
              key={t.id}
              className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2 py-1 text-sm text-teal-800 dark:bg-teal-800 dark:text-teal-100"
            >
              {t.name}
              <button
                aria-label="Remove translation"
                onClick={() => handleSelectionToggle(t.id)}
                className="ml-1 rounded-full p-0.5 hover:bg-teal-200 dark:hover:bg-teal-700"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="border-b border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search translations"
            className="w-full rounded-lg border border-gray-300 bg-[var(--background)] py-2 pl-8 pr-3 focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="sticky top-0 z-10 overflow-x-auto border-b border-gray-200 bg-[var(--background)]">
        <div className="flex gap-4 px-4 py-2">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => handleTabClick(lang)}
              className={`whitespace-nowrap pb-1 text-sm ${
                activeFilter === lang ? 'border-b-2 border-teal-500 font-semibold' : 'text-gray-500'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto">
        {languages.map((lang) => (
          <div
            key={lang}
            data-lang={lang}
            ref={(el) => {
              sectionsRef.current[lang] = el;
            }}
            className="p-4"
          >
            <h3 className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300">{lang}</h3>
            <ul className="space-y-1">
              {grouped[lang]
                .filter(
                  (t) =>
                    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    t.author.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((t) => (
                  <TranslationItem
                    key={t.id}
                    translation={t}
                    selected={selectedIds.includes(t.id)}
                    onToggle={() => handleSelectionToggle(t.id)}
                    draggable
                    onDragStart={handleDragStart(t.id)}
                    onDragOver={handleDragOver(t.id)}
                    onDrop={handleDrop}
                  />
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

interface TranslationItemProps {
  translation: Translation;
  selected: boolean;
  onToggle: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

const TranslationItem = ({
  translation,
  selected,
  onToggle,
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
}: TranslationItemProps) => (
  <li
    className="flex items-center justify-between rounded-md px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
    draggable={draggable}
    onDragStart={onDragStart}
    onDragOver={onDragOver}
    onDrop={onDrop}
    onDragEnd={onDrop}
  >
    <div className="flex items-center gap-2">
      <GripVertical size={14} className="text-gray-400" />
      <span className="text-sm">{translation.name}</span>
    </div>
    <button
      onClick={onToggle}
      className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-400"
    >
      {selected && <CheckIcon />}
    </button>
  </li>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 text-teal-600">
    <path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
  </svg>
);

export const App = () => <TranslationManager />;

export { TranslationManager as TranslationPanel };
