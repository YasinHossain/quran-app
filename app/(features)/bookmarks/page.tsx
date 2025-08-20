'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import {
  PinIcon,
  ClockIcon,
  FolderIcon,
  EllipsisHIcon,
  PlusIcon,
} from '@/app/shared/icons';
import { CreateFolderModal } from './components/CreateFolderModal';
import { BookmarkListView } from './components/BookmarkListView';
import { SearchInput } from '@/app/shared/components/SearchInput';

// ===== Reusable Components =====

const SidebarItem = ({
  icon: Icon,
  label,
  isActive,
}: {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
}) => (
  <button
    type="button"
    className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium ${
      isActive ? 'bg-accent/20 text-accent' : 'text-foreground hover:bg-surface/50'
    }`}
  >
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </button>
);

const FolderCard = ({
  name,
  count,
  onClick,
}: {
  name: string;
  count: number;
  onClick: () => void;
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    className="group relative cursor-pointer card hover:shadow-md"
    onClick={onClick}
  >
    <div className="flex items-center space-x-3">
      <FolderIcon size={24} className="text-accent" />
      <div>
        <h3 className="font-semibold text-foreground ">{name}</h3>
        <p className="text-sm text-muted ">{count} Bookmarks</p>
      </div>
    </div>
    <button
      className="absolute right-2 top-2 rounded-full p-1 text-muted hover:bg-surface/50 group-hover:opacity-100 md:opacity-0"
      onClick={(e) => e.stopPropagation()}
    >
      <EllipsisHIcon size={20} />
    </button>
  </motion.div>
);

const ContentHeader = ({
  onNewFolderClick,
  searchTerm,
  setSearchTerm,
}: {
  onNewFolderClick: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}) => (
  <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
    <h1 className="text-2xl font-bold text-foreground ">Bookmarks</h1>
    <div className="flex items-center space-x-2">
      <button
        onClick={onNewFolderClick}
        className="flex items-center space-x-2 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-on-accent hover:bg-accent-hover"
      >
        <PlusIcon size={16} />
        <span>New Folder</span>
      </button>
      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search Bookmarks"
        size="sm"
        className="w-48"
      />
    </div>
  </div>
);

// ===== Main Page Component =====

const BookmarksPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { folders } = useBookmarks();

  const selectedFolder = useMemo(() => {
    if (!selectedFolderId) return null;
    return folders.find((f) => f.id === selectedFolderId) || null;
  }, [selectedFolderId, folders]);

  const filteredFolders = useMemo(() => {
    return folders.filter((folder) =>
      folder.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [folders, searchTerm]);

  return (
    <>
      <CreateFolderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="flex h-full w-full bg-surface ">
        {/* Left Sidebar for Bookmark Navigation */}
        <aside className="w-72 flex-shrink-0 border-r border-border bg-surface p-4 ">
          <div className="space-y-4">
            <h1 className="px-3 text-xl font-bold text-foreground ">Bookmarks</h1>
            <nav className="space-y-1">
              <SidebarItem icon={PinIcon} label="Bookmarks" isActive={true} />
              <SidebarItem icon={PinIcon} label="Pin Ayah" />
              <SidebarItem icon={ClockIcon} label="Last Read" />
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto section">
          <AnimatePresence mode="wait">
            {selectedFolder ? (
              <BookmarkListView
                key={selectedFolder.id}
                folder={selectedFolder}
                onBack={() => setSelectedFolderId(null)}
              />
            ) : (
              <motion.div
                key="folder-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ContentHeader
                  onNewFolderClick={() => setIsModalOpen(true)}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
                <motion.div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  <AnimatePresence>
                    {filteredFolders.map((folder) => (
                      <FolderCard
                        key={folder.id}
                        name={folder.name}
                        count={folder.bookmarks.length}
                        onClick={() => setSelectedFolderId(folder.id)}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
                {filteredFolders.length === 0 && (
                  <div className="mt-10 text-center text-muted">
                    <p>No folders found for your search.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </>
  );
};

export default BookmarksPage;
