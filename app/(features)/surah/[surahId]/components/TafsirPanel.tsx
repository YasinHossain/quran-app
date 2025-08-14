'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, GripVertical, X, AlertCircle, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { useTheme } from '@/app/providers/ThemeContext';
import { useSettings } from '@/app/providers/SettingsContext';
import { getTafsirResources } from '@/lib/api';
import { TafsirResource } from '@/types';
import useSWR from 'swr';
import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';

// --- TYPE DEFINITIONS ---
interface Tafsir {
  id: number;
  name: string;
  lang: string;
  selected: boolean;
}

const MAX_SELECTIONS = 3;

// --- HELPER FUNCTIONS ---
const capitalizeLanguageName = (lang: string): string => {
  return lang
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

interface TafsirPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// --- MAIN COMPONENT ---
export const TafsirPanel: React.FC<TafsirPanelProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useTheme();
  const { settings, setTafsirIds } = useSettings();
  const { data } = useSWR('tafsirs', getTafsirResources);
  const [tafsirs, setTafsirs] = useState<Tafsir[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [orderedSelection, setOrderedSelection] = useState<number[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);
  const [isAtTop, setIsAtTop] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const { isHidden } = useHeaderVisibility();

  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const isUserClickRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Load tafsirs from API
  useEffect(() => {
    const loadTafsirs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (data) {
          // Transform API data to our format
          const formattedTafsirs: Tafsir[] = data.map((t) => ({
            id: t.id,
            name: t.name,
            lang: capitalizeLanguageName(t.language_name),
            selected: false
          }));
          
          setTafsirs(formattedTafsirs);
        }
        
        // Selections will be initialized by the useEffect that handles settings sync
      } catch (err) {
        console.error('Failed to load tafsirs:', err);
        setError('Failed to load tafsirs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadTafsirs();
    }
  }, [isOpen, data]);

  // Track if we're in the middle of updating to prevent circular dependencies
  const isUpdatingRef = useRef(false);

  // Save selections to settings whenever they change (only if user initiated)
  useEffect(() => {
    if (isUpdatingRef.current) return; // Skip if we're updating from settings
    
    const currentSelection = [...orderedSelection];
    const settingsIds = settings.tafsirIds || [];
    
    // Only update if the selection is different from current settings
    if (JSON.stringify(currentSelection) !== JSON.stringify(settingsIds)) {
      isUpdatingRef.current = true;
      setTafsirIds(currentSelection);
      
      // Reset the flag after a short delay
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 50);
    }
  }, [orderedSelection, setTafsirIds, settings.tafsirIds]);

  // Initialize from settings only once when panel opens
  useEffect(() => {
    if (isOpen && tafsirs.length > 0) {
      const settingsIds = settings.tafsirIds || [];
      isUpdatingRef.current = true;
      setSelectedIds(new Set(settingsIds));
      setOrderedSelection(settingsIds);
      
      // Reset the flag after a short delay
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 50);
    }
  }, [isOpen, tafsirs.length, settings.tafsirIds]);

  const languages = React.useMemo(() => {
    const uniqueLanguages = [...new Set(tafsirs.map((t) => t.lang))];
    
    // Custom sort: English first, then Bengali/Bangla, then Arabic, then alphabetical
    const sortedLanguages = uniqueLanguages.sort((a, b) => {
      // Priority order: English first, then Bengali/Bangla, then Arabic, then alphabetical
      const getLanguagePriority = (lang: string) => {
        const lower = lang.toLowerCase();
        if (lower === 'english') return 0;
        if (lower === 'bengali' || lower === 'bangla') return 1;
        if (lower === 'arabic') return 2;
        return 3;
      };
      
      const priorityA = getLanguagePriority(a);
      const priorityB = getLanguagePriority(b);
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      // Same priority, sort alphabetically
      return a.localeCompare(b);
    });
    
    return ['All', ...sortedLanguages];
  }, [tafsirs]);

  const filteredTafsirs = React.useMemo(() => {
    if (searchTerm === '') return tafsirs;
    
    const searchLower = searchTerm.toLowerCase();
    return tafsirs.filter((item) => {
      // Exact literal search - check if search term exists as a substring
      return item.name.toLowerCase().includes(searchLower) || 
             item.lang.toLowerCase().includes(searchLower);
    });
  }, [tafsirs, searchTerm]);

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
      // Remove selection
      newSelectedIds.delete(id);
      newOrderedSelection = newOrderedSelection.filter((selId) => selId !== id);
      setShowLimitWarning(false);
    } else {
      // Add selection with limit check
      if (selectedIds.size >= MAX_SELECTIONS) {
        setShowLimitWarning(true);
        setTimeout(() => setShowLimitWarning(false), 3000);
        return;
      }
      newSelectedIds.add(id);
      newOrderedSelection.push(id);
    }
    
    setSelectedIds(newSelectedIds);
    setOrderedSelection(newOrderedSelection);
  };

  const handleTabClick = (lang: string) => {
    isUserClickRef.current = true;
    setActiveFilter(lang);
    
    // Clear highlighted section when switching to a specific language
    if (lang !== 'All') {
      setHighlightedSection(null);
    }

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

  // Check if tabs can scroll
  const checkScrollState = useCallback(() => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  // Scroll tabs left
  const scrollTabsLeft = () => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  // Scroll tabs right
  const scrollTabsRight = () => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Update scroll state when tabs change or component mounts
  useEffect(() => {
    checkScrollState();
    if (tabsContainerRef.current) {
      const container = tabsContainerRef.current;
      container.addEventListener('scroll', checkScrollState);
      window.addEventListener('resize', checkScrollState);
      
      return () => {
        container.removeEventListener('scroll', checkScrollState);
        window.removeEventListener('resize', checkScrollState);
      };
    }
  }, [languages, checkScrollState]);

  // Reset to first English tafsir
  const handleReset = () => {
    const englishTafsir = tafsirs.find(
      (t) => t.lang.toLowerCase() === 'english'
    );
    
    if (englishTafsir) {
      const newSelectedIds = new Set([englishTafsir.id]);
      const newOrderedSelection = [englishTafsir.id];
      
      setSelectedIds(newSelectedIds);
      setOrderedSelection(newOrderedSelection);
      setShowLimitWarning(false);
    }
  };

  return (
    <div
      data-testid="tafsir-panel"
      className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } ${theme === 'dark' ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-800'}`}
    >
      {/* Selection Limit Warning */}
      {showLimitWarning && (
        <div className={`absolute top-16 left-4 right-4 p-3 rounded-lg z-20 flex items-center space-x-2 ${
          theme === 'dark' ? 'bg-red-900/90 border-red-700' : 'bg-red-50 border-red-200'
        } border`}>
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <span className={`text-sm ${
            theme === 'dark' ? 'text-red-200' : 'text-red-800'
          }`}>
            Maximum {MAX_SELECTIONS} tafsirs can be selected
          </span>
        </div>
      )}
      <header className={`flex items-center p-4 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
        <button
          onClick={onClose}
          className={`p-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-200'}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className={`text-lg font-bold text-center flex-grow ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
          Manage Tafsirs
        </h2>
        <button
          onClick={handleReset}
          className={`p-2 rounded-full focus:outline-none transition-colors ${theme === 'dark' ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
          title="Reset to Default"
        >
          <RotateCcw size={20} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center p-8">
            <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
              theme === 'dark' ? 'border-slate-400' : 'border-slate-600'
            }`}></div>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className={`mx-4 mt-4 p-4 rounded-lg border ${
            theme === 'dark' ? 'bg-red-900/20 border-red-700 text-red-200' : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        {!loading && !error && (
          <>
            <div className="p-4 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className={`h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
                <input
                  type="text"
                  placeholder="Search tafsirs (exact match)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition border ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-900'}`}
                />
              </div>
              
              {/* My Selections */}
              <div>
                <h2 className={`text-sm font-semibold px-1 mb-2 flex items-center justify-between ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span>MY SELECTIONS ({orderedSelection.length}/{MAX_SELECTIONS})</span>
                  {orderedSelection.length >= MAX_SELECTIONS && (
                    <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                      MAX
                    </span>
                  )}
                </h2>
                <div className={`space-y-2 min-h-[40px] rounded-lg p-2 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'} border`}>
                  {orderedSelection.length === 0 ? (
                    <p className={`text-center text-sm py-2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                      No tafsirs selected
                    </p>
              ) : (
                orderedSelection.map((id) => {
                  const item = tafsirs.find((t) => t.id === id);
                  if (!item) return null;
                  return (
                    <div
                      key={id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, id)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, id)}
                      onDragEnd={handleDragEnd}
                      className={`flex items-center justify-between p-2 rounded-lg shadow-sm cursor-grab active:cursor-grabbing transition-opacity border ${draggedId === id ? 'opacity-50' : 'opacity-100'} ${theme === 'dark' ? 'bg-slate-700/50 border-slate-700' : 'bg-white border-slate-200'}`}
                    >
                      <div className="flex items-center min-w-0">
                        <GripVertical className={`h-5 w-5 mr-2 flex-shrink-0 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
                        <span className={`font-medium text-sm truncate ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                          {item.name}
                        </span>
                      </div>
                      <button
                        onClick={() => handleSelectionToggle(id)}
                        className={`hover:text-red-500 transition-colors p-1 rounded-full flex-shrink-0 ml-2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}
                      >
                        <X size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  );
                })
                  )}
                </div>
              </div>
            </div>

            <div
              ref={stickyHeaderRef}
              className={`sticky top-0 z-10 backdrop-blur-sm pt-2 pb-0 border-b ${theme === 'dark' ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-slate-200'}`}
            >
              <div className="px-4">
                <div className="flex items-center pb-2">
                  {/* Left Arrow */}
                  <button
                    onClick={scrollTabsLeft}
                    disabled={!canScrollLeft}
                    className={`p-1 rounded-full mr-2 transition-colors ${
                      canScrollLeft
                        ? theme === 'dark'
                          ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                        : theme === 'dark'
                          ? 'text-slate-600 cursor-not-allowed'
                          : 'text-slate-300 cursor-not-allowed'
                    }`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  {/* Tabs Container */}
                  <div 
                    ref={tabsContainerRef}
                    className="flex items-center space-x-2 overflow-x-hidden flex-1"
                  >
                    {languages.map((lang) => {
                      // Determine if this tab should be highlighted
                      let isHighlighted = false;
                      
                      if (activeFilter === 'All') {
                        if (isAtTop) {
                          // At the top: highlight "All" tab
                          isHighlighted = lang === 'All';
                        } else {
                          // Scrolled down: highlight the currently visible section
                          isHighlighted = lang === highlightedSection;
                        }
                      } else {
                        // In specific language view: only highlight the active filter
                        isHighlighted = activeFilter === lang;
                      }
                      
                      return (
                        <button
                          key={lang}
                          onClick={() => handleTabClick(lang)}
                          className={`flex-shrink-0 px-3 py-2 text-sm font-semibold border-b-2 transition-colors ${
                            isHighlighted
                              ? 'border-blue-600 text-blue-600'
                              : `border-transparent ${theme === 'dark' ? 'text-slate-400 hover:text-slate-200 hover:border-slate-600' : 'text-slate-500 hover:text-slate-800 hover:border-slate-300'}`
                          }`}
                        >
                          {lang}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Right Arrow */}
                  <button
                    onClick={scrollTabsRight}
                    disabled={!canScrollRight}
                    className={`p-1 rounded-full ml-2 transition-colors ${
                      canScrollRight
                        ? theme === 'dark'
                          ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                        : theme === 'dark'
                          ? 'text-slate-600 cursor-not-allowed'
                          : 'text-slate-300 cursor-not-allowed'
                    }`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="px-4 pb-4">
              <div className="mt-4">
                {activeFilter === 'All' ? (
                  <div className="space-y-4">
                    {languages.slice(1).map((lang) => {
                      const items = groupedTafsirs[lang] || [];
                      if (items.length === 0) return null;
                      return (
                        <div key={lang} className="lang-section" data-lang={lang}>
                          <h3 className={`lang-header text-lg font-bold pb-2 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`} data-lang={lang}>
                            {lang}
                          </h3>
                          <div className="space-y-2">
                            {items.map((item) => (
                              <TafsirItem
                                key={item.id}
                                item={item}
                                isSelected={selectedIds.has(item.id)}
                                onToggle={handleSelectionToggle}
                                theme={theme}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {(groupedTafsirs[activeFilter] || []).map((item) => (
                      <TafsirItem
                        key={item.id}
                        item={item}
                        isSelected={selectedIds.has(item.id)}
                        onToggle={handleSelectionToggle}
                        theme={theme}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface TafsirItemProps {
  item: Tafsir;
  isSelected: boolean;
  onToggle: (id: number) => void;
  theme: string;
}

const TafsirItem: React.FC<TafsirItemProps> = ({ item, isSelected, onToggle, theme }) => {
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
      className={`flex items-center justify-between px-4 py-3 h-[52px] rounded-lg cursor-pointer transition-all duration-200 border ${
        isSelected
          ? theme === 'dark' 
            ? 'bg-blue-900/30 border-blue-700/50 shadow-sm' 
            : 'bg-blue-50 border-blue-200 shadow-sm'
          : theme === 'dark' 
            ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600' 
            : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
      }`}
    >
      <div className="flex-1 min-w-0 pr-3">
        <p className={`font-medium text-sm leading-tight truncate ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`} title={item.name}>
          {item.name}
        </p>
      </div>
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
        {isSelected && <CheckIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
      </div>
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
