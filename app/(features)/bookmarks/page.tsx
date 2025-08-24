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

const BookmarksPage = () => {
  const { folders } = useBookmarks();
  const modal = useModal();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'name-asc' | 'name-desc' | 'most-verses'>(
    'recent'
  );
  const router = useRouter();
  const { isHidden } = useHeaderVisibility();

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

  const handleSectionChange = (section: string) => {
    if (section === 'pinned') {
      router.push('/bookmarks/pinned');
    } else if (section === 'last-read') {
      router.push('/bookmarks/last-read');
    } else {
      router.push('/bookmarks');
    }
  };

  return (
    <>
      <CreateFolderModal isOpen={modal.isOpen} onClose={modal.close} />

      <div className="flex h-[calc(100vh-4rem)] mt-16 bg-background">
        {/* Left Sidebar */}
        <aside className="w-full sm:w-80 lg:w-[20.7rem] bg-background text-foreground flex flex-col shadow-modal md:shadow-lg z-modal md:z-10 md:h-full hidden lg:block">
          <BookmarksSidebar activeSection="bookmarks" onSectionChange={handleSectionChange} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 h-full overflow-hidden">
          <div
            className={`h-full overflow-y-auto px-4 sm:px-6 lg:px-8 pb-6 transition-all duration-300 ${
              isHidden
                ? 'pt-0'
                : 'pt-[calc(3.5rem+env(safe-area-inset-top))] sm:pt-[calc(4rem+env(safe-area-inset-top))]'
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
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-surface-overlay/60 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-full sm:w-80 lg:w-[20.7rem] bg-background text-foreground border-r border-border z-50 lg:hidden"
            >
              <BookmarksSidebar activeSection="bookmarks" onSectionChange={handleSectionChange} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default BookmarksPage;
