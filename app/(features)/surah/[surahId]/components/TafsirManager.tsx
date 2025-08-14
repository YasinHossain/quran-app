'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Search, GripVertical, X } from 'lucide-react';
import { useSettings } from '@/app/providers/SettingsContext';
import { TafsirResource } from '@/types';
import { ArrowLeftIcon } from '@/app/shared/icons/ArrowLeftIcon';
import { CheckIcon } from '@/app/shared/icons/CheckIcon';

// --- TYPE DEFINITIONS ---
interface Tafsir {
  id: number;
  name: string;
  lang: string;
}

interface TafsirManagerProps {
  isOpen: boolean;
  onClose: () => void;
  tafsirs: TafsirResource[];
}

const TafsirManager: React.FC<TafsirManagerProps> = ({
  isOpen,
  onClose,
  tafsirs: tafsirResources,
}) => {
  const { settings, setSettings } = useSettings();

  const mappedTafsirs = useMemo(() => {
    return tafsirResources.map((t) => ({
      id: t.id,
      name: t.name,
      lang: t.language_name,
    }));
  }, [tafsirResources]);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set(settings.tafsirIds));
  const [orderedSelection, setOrderedSelection] = useState<number[]>(settings.tafsirIds);

  useEffect(() => {
    setSelectedIds(new Set(settings.tafsirIds));
    setOrderedSelection(settings.tafsirIds);
  }, [settings.tafsirIds]);

  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedId, setDraggedId] = useState<number | null>(null);

  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isUserClickRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const languages = useMemo(
    () => ['All', ...new Set(mappedTafsirs.map((t) => t.lang))],
    [mappedTafsirs]
  );

  const filteredTafsirs = React.useMemo(() => {
    return mappedTafsirs.filter(
      (item) => searchTerm === '' || item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [mappedTafsirs, searchTerm]);

  const groupedTafsirs = React.useMemo(() => {
    return filteredTafsirs.reduce(
      (acc, item) => {
        (acc[item.lang] = acc[item.lang] || []).push(item);
        return acc;
      },
      {} as Record<string, Tafsir[]>
    );
  }, [filteredTafsirs]);

  const handleSelectionToggle = (id: number) => {
    const newSelectedIds = new Set(selectedIds);
    let newOrderedSelection = [...orderedSelection];

    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
      newOrderedSelection = newOrderedSelection.filter((selId) => selId !== id);
    } else {
      if (newSelectedIds.size < 3) {
        newSelectedIds.add(id);
        newOrderedSelection.push(id);
      } else {
        // Here you might want to show a notification to the user
        console.warn('You can select a maximum of 3 tafsirs.');
        return;
      }
    }
    setSelectedIds(newSelectedIds);
    setOrderedSelection(newOrderedSelection);
  };

  // Persist selection to settings
  useEffect(() => {
    // Avoid setting settings if the arrays are identical
    if (JSON.stringify(settings.tafsirIds) !== JSON.stringify(orderedSelection)) {
      setSettings((prev) => ({ ...prev, tafsirIds: orderedSelection }));
    }
  }, [orderedSelection, setSettings, settings.tafsirIds]);

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
  }, [activeFilter, groupedTafsirs, setupScrollObserver, isOpen]);

  // --- DRAG & DROP HANDLERS ---
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

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedId(null);
      return;
    }

    const [draggedItem] = newOrderedSelection.splice(draggedIndex, 1);
    newOrderedSelection.splice(targetIndex, 0, draggedItem);

    setOrderedSelection(newOrderedSelection);
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

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
                Manage Tafsirs
              </h1>
              <div className="w-8" />
            </header>

            <div ref={contentRef} className="overflow-y-auto">
              <div className="p-4 space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 px-1 mb-2">
                    MY SELECTIONS ({orderedSelection.length})
                  </h2>
                  <div className="space-y-2 min-h-[40px] bg-slate-100 dark:bg-slate-800/50 rounded-lg p-2">
                    {orderedSelection.length === 0 ? (
                      <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-2">
                        No tafsirs selected
                      </p>
                    ) : (
                      orderedSelection.map((id) => {
                        const item = mappedTafsirs.find((t) => t.id === id);
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
                              aria-label={`Remove ${item.name}`}
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
                      {Object.entries(groupedTafsirs).map(([lang, items]) => (
                        <div key={lang} className="lang-section" data-lang={lang}>
                          <h3 className="lang-header text-lg font-bold text-slate-700 dark:text-slate-300 pb-2 pt-2">
                            {lang}
                          </h3>
                          <div className="space-y-2">
                            {items.map((item) => (
                              <TafsirItem
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
                      {(groupedTafsirs[activeFilter] || []).map((item) => (
                        <TafsirItem
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
        </div>
      </div>
    </div>
  );
};

interface TafsirItemProps {
  item: Tafsir;
  isSelected: boolean;
  onToggle: (id: number) => void;
}

const TafsirItem: React.FC<TafsirItemProps> = ({ item, isSelected, onToggle }) => {
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

export { TafsirManager };
