'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// Debounce interval for persisting bookmarks to localStorage.
const PERSIST_DEBOUNCE_MS = 300;

interface BookmarkContextType {
  bookmarkedVerses: string[];
  toggleBookmark: (verseId: string) => void;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

/**
 * Provides global verse bookmark state.
 * Wrap parts of the app that need bookmark access with this provider and
 * use the {@link useBookmarks} hook to interact with it.
 */
export const BookmarkProvider = ({ children }: { children: React.ReactNode }) => {
  const [bookmarkedVerses, setBookmarkedVerses] = useState<string[]>([]);
  const bookmarksTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestBookmarks = useRef(bookmarkedVerses);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedBookmarks = localStorage.getItem('quranAppBookmarks');
      if (savedBookmarks) {
        try {
          setBookmarkedVerses(JSON.parse(savedBookmarks));
        } catch (error) {
          console.error('Error parsing bookmarks from localStorage:', error);
        }
      }
    }
  }, []);

  // Save bookmarks when changed (debounced)
  useEffect(() => {
    latestBookmarks.current = bookmarkedVerses;
    if (typeof window === 'undefined') return;

    bookmarksTimeoutRef.current = setTimeout(() => {
      localStorage.setItem('quranAppBookmarks', JSON.stringify(bookmarkedVerses));
      bookmarksTimeoutRef.current = null;
    }, PERSIST_DEBOUNCE_MS);

    return () => {
      if (bookmarksTimeoutRef.current) clearTimeout(bookmarksTimeoutRef.current);
    };
  }, [bookmarkedVerses]);

  // Flush any pending writes on unmount
  useEffect(() => {
    return () => {
      if (typeof window === 'undefined') return;
      if (bookmarksTimeoutRef.current) {
        clearTimeout(bookmarksTimeoutRef.current);
        localStorage.setItem('quranAppBookmarks', JSON.stringify(latestBookmarks.current));
      }
    };
  }, []);

  const toggleBookmark = useCallback(
    (verseId: string) => {
      setBookmarkedVerses((prev) =>
        prev.includes(verseId) ? prev.filter((id) => id !== verseId) : [...prev, verseId]
      );
    },
    [setBookmarkedVerses]
  );

  const value = useMemo(
    () => ({ bookmarkedVerses, toggleBookmark }),
    [bookmarkedVerses, toggleBookmark]
  );

  return <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>;
};

export const useBookmarks = () => {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error('useBookmarks must be used within BookmarkProvider');
  return ctx;
};
