'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, GripVertical, X, AlertCircle, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { useTheme } from '@/app/providers/ThemeContext';
import { useSettings } from '@/app/providers/SettingsContext';
import { getTranslations } from '@/lib/api/translations';
import { TranslationResource } from '@/types';

// --- TYPE DEFINITIONS ---
interface Translation {
  id: number;
  name: string;
  lang: string;
  selected: boolean;
}

const MAX_SELECTIONS = 5;
const STORAGE_KEY = 'selected-translations';

// --- HELPER FUNCTIONS ---
const capitalizeLanguageName = (lang: string): string => {
  return lang
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const loadSelectedTranslations = (): number[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveSelectedTranslations = (ids: number[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Handle storage errors silently
  }
};

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

interface TranslationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// --- MAIN COMPONENT ---
export const TranslationPanel: React.FC<TranslationPanelProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useTheme();
  const { settings, setTranslationIds } = useSettings();
  const [translations, setTranslations] = useState<Translation[]>([]);
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

  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const isUserClickRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Load translations from API
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiTranslations = await getTranslations();
        
        // Transform API data to our format
        const formattedTranslations: Translation[] = apiTranslations.map((t) => ({
          id: t.id,
          name: t.name,
          lang: capitalizeLanguageName(t.language_name),
          selected: false
        }));
        
        setTranslations(formattedTranslations);
        
        // Selections will be initialized by the useEffect that handles settings sync
      } catch (err) {
        console.error('Failed to load translations:', err);
        setError('Failed to load translations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadTranslations();
    }
  }, [isOpen]);

  // Track if we're in the middle of updating to prevent circular dependencies
  const isUpdatingRef = useRef(false);

  // Save selections to settings whenever they change (only if user initiated)
  useEffect(() => {
    if (isUpdatingRef.current) return; // Skip if we're updating from settings
    
    const currentSelection = [...orderedSelection];
    const settingsIds = settings.translationIds || [];
    
    // Only update if the selection is different from current settings
    if (JSON.stringify(currentSelection) !== JSON.stringify(settingsIds)) {
      isUpdatingRef.current = true;
      setTranslationIds(currentSelection);
      // Also sync to the old localStorage key for backward compatibility
      saveSelectedTranslations(currentSelection);
      
      // Reset the flag after a short delay
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 50);
    }
  }, [orderedSelection, setTranslationIds]);

  // Initialize from settings only once when panel opens
  useEffect(() => {
    if (isOpen && translations.length > 0) {
      const settingsIds = settings.translationIds || [];
      isUpdatingRef.current = true;
      setSelectedIds(new Set(settingsIds));
      setOrderedSelection(settingsIds);
      
      // Reset the flag after a short delay
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 50);
    }
  }, [isOpen, translations.length, settings.translationIds]);

  const languages = React.useMemo(() => {
    const uniqueLanguages = [...new Set(translations.map((t) => t.lang))];
    
    // Custom sort: English first, then Bengali/Bangla, then alphabetical
    const sortedLanguages = uniqueLanguages.sort((a, b) => {
      // Priority order: English first, then Bengali/Bangla, then alphabetical
      const getLanguagePriority = (lang: string) => {
        const lower = lang.toLowerCase();
        if (lower === 'english') return 0;
        if (lower === 'bengali' || lower === 'bangla') return 1;
        return 2;
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
  }, [translations]);

  const filteredTranslations = React.useMemo(() => {
    if (searchTerm === '') return translations;
    
    const searchLower = searchTerm.toLowerCase();
    return translations.filter((item) => {
      // Exact literal search - check if search term exists as a substring
      return item.name.toLowerCase().includes(searchLower) || 
             item.lang.toLowerCase().includes(searchLower);
    });
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

  const setupScrollObserver = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect();

    // Wait for DOM to be ready and find sections
    const sections = document.querySelectorAll('.lang-section');
    console.log('Found sections:', sections.length); // Debug log
    
    if (sections.length === 0) {
      console.log('No sections found, retrying in 500ms');
      setTimeout(() => setupScrollObserver(), 500);
      return;
    }

    if (!stickyHeaderRef.current) return;

    const stickyHeaderHeight = stickyHeaderRef.current.offsetHeight;
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (isUserClickRef.current || isAtTop) return; // Skip if user clicked or at top

        // Only track highlighted section when in "All" view and not at top
        if (activeFilter === 'All') {
          // Find the section that's most visible
          let mostVisibleSection = null;
          let highestRatio = 0;
          
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > highestRatio) {
              mostVisibleSection = entry.target;
              highestRatio = entry.intersectionRatio;
            }
          });

          if (mostVisibleSection) {
            const lang = (mostVisibleSection as HTMLElement).dataset.lang;
            console.log('Most visible section:', lang, 'ratio:', highestRatio); // Debug log
            
            if (lang && lang !== highlightedSection) {
              setHighlightedSection(lang);
            }
          }
        }
      },
      {
        root: document.querySelector('[data-testid="translation-panel"] .flex-1.overflow-y-auto'), // Use the panel's scroll container
        rootMargin: `-${stickyHeaderHeight + 50}px 0px -40% 0px`, // Adjusted margins
        threshold: [0, 0.1, 0.3, 0.5, 0.7, 1.0],
      }
    );

    sections.forEach((section) => observerRef.current?.observe(section));
    console.log('Observer set up for', sections.length, 'sections'); // Debug log
  }, [activeFilter, highlightedSection, isAtTop]);

  // Track scroll position to detect if we're at the top of the TranslationPanel
  const handleScroll = useCallback(() => {
    if (activeFilter !== 'All') return; // Only track when in "All" view
    
    // Find the scrollable container within the TranslationPanel
    const panelScrollContainer = document.querySelector('[data-testid="translation-panel"] .flex-1.overflow-y-auto');
    if (panelScrollContainer) {
      const scrollTop = panelScrollContainer.scrollTop;
      const newIsAtTop = scrollTop <= 50; // Consider "at top" if within 50px of top
      
      console.log('Panel scroll position:', scrollTop, 'isAtTop:', newIsAtTop); // Debug log
      
      if (newIsAtTop !== isAtTop) {
        console.log('Changing isAtTop from', isAtTop, 'to', newIsAtTop); // Debug log
        setIsAtTop(newIsAtTop);
        
        // Clear highlighted section when returning to top
        if (newIsAtTop) {
          setHighlightedSection(null);
        }
      }
    }
  }, [isAtTop, activeFilter]);

  useEffect(() => {
    // Set up scroll listener when panel is open
    if (isOpen) {
      const panelScrollContainer = document.querySelector('[data-testid="translation-panel"] .flex-1.overflow-y-auto');
      if (panelScrollContainer) {
        // Initial check
        handleScroll();
        panelScrollContainer.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => {
          panelScrollContainer.removeEventListener('scroll', handleScroll);
        };
      }
    }
  }, [isOpen, handleScroll]);

  useEffect(() => {
    // Only set up scroll observer when viewing 'All' languages and translations are loaded
    if (activeFilter === 'All' && translations.length > 0) {
      // Add a small delay to ensure DOM is fully rendered
      const timeoutId = setTimeout(() => {
        setupScrollObserver();
      }, 200); // Increased delay
      
      return () => {
        clearTimeout(timeoutId);
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    } else {
      // Clean up observer when not in 'All' view
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    }
  }, [activeFilter, translations.length, setupScrollObserver]);

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

  // Auto-scroll tab bar to keep highlighted tab visible
  const scrollToTab = useCallback((targetLang: string) => {
    if (!tabsContainerRef.current) return;
    
    const container = tabsContainerRef.current;
    const targetButton = container.querySelector(`button:nth-child(${languages.indexOf(targetLang) + 1})`);
    
    if (targetButton) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = targetButton.getBoundingClientRect();
      
      // Check if button is outside the visible area
      const isOutsideLeft = buttonRect.left < containerRect.left;
      const isOutsideRight = buttonRect.right > containerRect.right;
      
      if (isOutsideLeft || isOutsideRight) {
        // Calculate scroll position to center the button
        const buttonOffsetLeft = (targetButton as HTMLElement).offsetLeft;
        const buttonWidth = buttonRect.width;
        const containerWidth = containerRect.width;
        
        const targetScrollLeft = buttonOffsetLeft - (containerWidth / 2) + (buttonWidth / 2);
        
        container.scrollTo({
          left: Math.max(0, targetScrollLeft),
          behavior: 'smooth'
        });
      }
    }
  }, [languages]);

  // Auto-scroll when highlighted section changes
  useEffect(() => {
    if (activeFilter === 'All') {
      if (isAtTop) {
        // Scroll to "All" tab when at top
        scrollToTab('All');
      } else if (highlightedSection) {
        // Scroll to highlighted section when scrolled down
        scrollToTab(highlightedSection);
      }
    }
  }, [highlightedSection, activeFilter, isAtTop, scrollToTab]);

  // Reset to Sahih International translation
  const handleReset = () => {
    const sahihInternational = translations.find(
      (t) => t.name.toLowerCase().includes('saheeh international') || 
             t.name.toLowerCase().includes('sahih international')
    );
    
    if (sahihInternational) {
      const newSelectedIds = new Set([sahihInternational.id]);
      const newOrderedSelection = [sahihInternational.id];
      
      setSelectedIds(newSelectedIds);
      setOrderedSelection(newOrderedSelection);
      setShowLimitWarning(false);
    }
  };

  return (
    <div
      data-testid="translation-panel"
      className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out z-50 shadow-lg ${
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
            Maximum {MAX_SELECTIONS} translations can be selected
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
          Manage Translations
        </h2>
        <button
          onClick={handleReset}
          className={`p-2 rounded-full focus:outline-none transition-colors ${theme === 'dark' ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
          title="Reset to Sahih International"
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
                  placeholder="Search translations (exact match)..."
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
                      const items = groupedTranslations[lang] || [];
                      if (items.length === 0) return null;
                      return (
                        <div key={lang} className="lang-section" data-lang={lang}>
                          <h3 className={`lang-header text-lg font-bold pb-2 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`} data-lang={lang}>
                            {lang}
                          </h3>
                          <div className="space-y-2">
                            {items.map((item) => (
                              <TranslationItem
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
                    {(groupedTranslations[activeFilter] || []).map((item) => (
                      <TranslationItem
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

interface TranslationItemProps {
  item: Translation;
  isSelected: boolean;
  onToggle: (id: number) => void;
  theme: string;
}

const TranslationItem: React.FC<TranslationItemProps> = ({ item, isSelected, onToggle, theme }) => {
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
