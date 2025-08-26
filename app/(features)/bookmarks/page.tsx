'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { CreateFolderModal } from './components/CreateFolderModal';
import { BookmarksSidebar } from './components/BookmarksSidebar';
import { FolderGrid } from './components/FolderGrid';
import { BookmarkIcon } from '@/app/shared/icons';
import { useModal } from '@/app/shared/hooks/useModal';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { useSidebar } from '@/app/providers/SidebarContext';
import type { SectionId } from '@/app/shared/ui/cards/BookmarkNavigationCard';

const BookmarksPage = () => {
  const { folders } = useBookmarks();
  const modal = useModal();
  const [sortBy, setSortBy] = useState<'recent' | 'name-asc' | 'name-desc' | 'most-verses'>(
    'recent'
  );
  const router = useRouter();
  const { isHidden } = useHeaderVisibility();
  const { isBookmarkSidebarOpen, setBookmarkSidebarOpen } = useSidebar();

  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const filteredFolders = folders;

  const sortedFolders = React.useMemo(() => {
    const items = [...filteredFolders];
    switch (sortBy) {
      case 'name-asc':
        return items.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return items.sort((a, b) => b.name.localeCompare(a.name));
      case 'most-verses':
        return items.sort((a, b) => b.bookmarks.length - a.bookmarks.length);
      case 'recent':
      default:
        return items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }
  }, [filteredFolders, sortBy]);

  const handleFolderSelect = (folderId: string) => {
    router.push(`/bookmarks/${folderId}`);
  };

  const handleSectionChange = (section: SectionId) => {
    if (section === 'pinned') {
      router.push('/bookmarks/pinned');
    } else if (section === 'last-read') {
      router.push('/bookmarks/last-read');
    } else if (section === 'memorization') {
      router.push('/bookmarks/memorization');
    } else {
      router.push('/bookmarks');
    }
  };

  return (
    <>
      <CreateFolderModal isOpen={modal.isOpen} onClose={modal.close} />

      <div className="flex h-[calc(100vh-4rem)] mt-16 bg-background">
        {/* Left Sidebar */}
        <aside className="w-full sm:w-80 lg:w-80 bg-background text-foreground flex flex-col shadow-modal md:shadow-lg z-modal md:z-10 md:h-full hidden lg:block">
          <BookmarksSidebar
            activeSection="bookmarks"
            onSectionChange={handleSectionChange}
            folders={folders}
            onVerseClick={(verseKey) => {
              // Navigate to the verse (you can customize this logic)
              const [surahId, ayahNumber] = verseKey.split(':');
              router.push(`/surah/${surahId}#verse-${verseKey}`);
            }}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 h-full overflow-hidden">
          <div
            className={`h-full overflow-y-auto p-4 sm:p-6 md:p-8 pb-6 transition-all duration-300 ${
              isHidden
                ? 'pt-4 sm:pt-6 md:pt-8'
                : 'pt-[calc(3.5rem+1rem+env(safe-area-inset-top))] sm:pt-[calc(4rem+1.5rem+env(safe-area-inset-top))] md:pt-[calc(4rem+2rem+env(safe-area-inset-top))]'
            }`}
          >
            {/* Bookmarks Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-sm">
                  <BookmarkIcon size={20} className="text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg font-bold text-foreground">Bookmarks</h1>
                  <p className="text-xs text-muted">Organize your verses</p>
                </div>
              </div>
            </div>

            <motion.div
              key="folder-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FolderGrid
                folders={sortedFolders}
                allFolders={folders}
                onFolderSelect={handleFolderSelect}
                onCreateFolder={modal.open}
                searchTerm=""
                onClearSearch={() => {}}
              />
            </motion.div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isBookmarkSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBookmarkSidebarOpen(false)}
              className="fixed inset-0 bg-surface-overlay/60 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-full sm:w-80 lg:w-80 bg-background text-foreground border-r border-border z-50 lg:hidden"
            >
              <BookmarksSidebar
                activeSection="bookmarks"
                onSectionChange={handleSectionChange}
                folders={folders}
                onVerseClick={(verseKey) => {
                  // Navigate to the verse (you can customize this logic)
                  const [surahId, ayahNumber] = verseKey.split(':');
                  router.push(`/surah/${surahId}#verse-${verseKey}`);
                  setBookmarkSidebarOpen(false);
                }}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default BookmarksPage;
