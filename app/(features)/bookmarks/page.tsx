'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { PinIcon, ClockIcon, FolderIcon, EllipsisHIcon, SearchIcon, PlusIcon } from '@/app/shared/icons';
import { CreateFolderModal } from './components/CreateFolderModal';
import { BookmarkListView } from './components/BookmarkListView';

// ===== Reusable Components =====

const SidebarItem = ({ icon: Icon, label, isActive }: { icon: React.ElementType, label: string, isActive?: boolean }) => (
  <a
    href="#"
    className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium ${
      isActive
        ? 'bg-teal-100 text-teal-900 dark:bg-teal-900 dark:text-white'
        : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
    }`}
  >
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </a>
);

const FolderCard = ({ name, count, color, onClick }: { name: string, count: number, color: string, onClick: () => void }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    className="group relative cursor-pointer rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
    onClick={onClick}
  >
    <div className="flex items-center space-x-3">
      <FolderIcon size={24} className={color} />
      <div>
        <h3 className="font-semibold text-gray-800 dark:text-white">{name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{count} Bookmarks</p>
      </div>
    </div>
    <button className="absolute right-2 top-2 rounded-full p-1 text-gray-500 hover:bg-gray-200 group-hover:opacity-100 dark:hover:bg-gray-700 md:opacity-0" onClick={(e) => e.stopPropagation()}>
      <EllipsisHIcon size={20} />
    </button>
  </motion.div>
);

const ContentHeader = ({ onNewFolderClick }: { onNewFolderClick: () => void }) => (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bookmarks</h1>
        <div className="flex items-center space-x-2">
            <button
              onClick={onNewFolderClick}
              className="flex items-center space-x-2 rounded-md bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700"
            >
              <PlusIcon size={16} />
              <span>New Folder</span>
            </button>
            <div className="relative">
                <SearchIcon size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search Bookmarks"
                    className="w-48 rounded-md border-gray-300 bg-gray-100 py-1.5 pl-9 pr-3 text-sm focus:border-teal-500 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700"
                />
            </div>
        </div>
    </div>
);


// ===== Main Page Component =====

const BookmarksPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const { folders } = useBookmarks();

  const selectedFolder = useMemo(() => {
    if (!selectedFolderId) return null;
    return folders.find(f => f.id === selectedFolderId) || null;
  }, [selectedFolderId, folders]);

  const colors = ['text-pink-500', 'text-indigo-500', 'text-green-500', 'text-yellow-500', 'text-blue-500'];

  return (
    <>
      <CreateFolderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="flex h-full w-full bg-white dark:bg-gray-900">
        {/* Left Sidebar for Bookmark Navigation */}
        <aside className="w-72 flex-shrink-0 border-r border-gray-200 bg-slate-50 p-4 dark:border-gray-700 dark:bg-slate-800/50">
          <div className="space-y-4">
            <h1 className="px-3 text-xl font-bold text-gray-900 dark:text-white">Bookmarks</h1>
            <nav className="space-y-1">
              <SidebarItem icon={PinIcon} label="Bookmarks" isActive={true} />
              <SidebarItem icon={PinIcon} label="Pin Ayah" />
              <SidebarItem icon={ClockIcon} label="Last Read" />
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
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
                <ContentHeader onNewFolderClick={() => setIsModalOpen(true)} />
                <motion.div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  <AnimatePresence>
                    {folders.map((folder, index) => (
                      <FolderCard
                        key={folder.id}
                        name={folder.name}
                        count={folder.bookmarks.length}
                        color={colors[index % colors.length]}
                        onClick={() => setSelectedFolderId(folder.id)}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
                {folders.length === 0 && (
                  <div className="mt-10 text-center text-gray-500">
                      <p>No folders yet.</p>
                      <p>Click "New Folder" to get started.</p>
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
