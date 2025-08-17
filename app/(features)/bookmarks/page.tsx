'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { FolderIcon, EllipsisHIcon, PlusIcon, PinIcon } from '@/app/shared/icons';
import { CreateFolderModal } from './components/CreateFolderModal';
import { BookmarkListView } from './components/BookmarkListView';
import BookmarkSidebar from './components/BookmarkSidebar';
import type { Folder } from '@/types/bookmark';

// ===== Reusable Components =====

const FolderCard = ({ name, count, color, onClick }: { name: string, count: number, color: string, onClick: () => void }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    className="group relative cursor-pointer rounded-xl border border-[var(--border-color)] bg-[var(--card-background)] p-4 hover:shadow-md transition transform hover:scale-[1.02]"
    onClick={onClick}
  >
    <div className="flex items-center space-x-3">
      <FolderIcon size={24} className={color} />
      <div>
        <h3 className="font-semibold text-[var(--foreground)]">{name}</h3>
        <p className="text-sm text-[var(--text-muted)]">{count} Bookmarks</p>
      </div>
    </div>
    <button className="absolute right-2 top-2 rounded-full p-1 text-[var(--text-muted)] hover:bg-[var(--hover-color)] group-hover:opacity-100 md:opacity-0" onClick={(e) => e.stopPropagation()}>
      <EllipsisHIcon size={20} />
    </button>
  </motion.div>
);

const BookmarksSection = ({ onNewFolderClick, folders, selectedFolderId, setSelectedFolderId }: {
  onNewFolderClick: () => void;
  folders: Folder[];
  selectedFolderId: string | null;
  setSelectedFolderId: (id: string | null) => void;
}) => {
  const colors = ['text-pink-500', 'text-indigo-500', 'text-green-500', 'text-yellow-500', 'text-blue-500'];
  
  const selectedFolder = useMemo(() => {
    if (!selectedFolderId) return null;
    return folders.find(f => f.id === selectedFolderId) || null;
  }, [selectedFolderId, folders]);

  return (
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
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Bookmarks</h1>
            <button
              onClick={onNewFolderClick}
              className="flex items-center space-x-2 rounded-md bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700"
            >
              <PlusIcon size={16} />
              <span>New Folder</span>
            </button>
          </div>
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
            <div className="mt-10 text-center text-[var(--text-muted)]">
              <p>No folders yet.</p>
              <p>Click "New Folder" to get started.</p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface PinnedAyah {
  id: string;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  arabicText: string;
  translation?: string;
  pinnedDate: string;
}

interface LastReading {
  id: string;
  surahNumber: number;
  surahName: string;
  lastAyah: number;
  progress: number;
  readDate: string;
  timeAgo: string;
}

const AyahCard = ({ ayah }: { ayah: PinnedAyah }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    className="group cursor-pointer rounded-xl border border-[var(--border-color)] bg-[var(--card-background)] p-4 hover:shadow-md transition transform hover:scale-[1.02]"
    onClick={() => {
      // TODO: Navigate to verse page
      console.log(`Navigate to Surah ${ayah.surahNumber}:${ayah.ayahNumber}`);
    }}
  >
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="rounded-md bg-teal-100 px-2 py-1 text-xs font-medium text-teal-800 dark:bg-teal-900 dark:text-teal-200">
            {ayah.surahName}
          </span>
          <span className="text-sm text-[var(--text-muted)]">
            {ayah.ayahNumber}
          </span>
        </div>
        <button className="rounded-full p-1 text-[var(--text-muted)] hover:bg-[var(--hover-color)] hover:text-[var(--foreground)]">
          <PinIcon size={16} />
        </button>
      </div>
      
      <div className="space-y-2">
        <p className="text-right text-lg leading-relaxed text-[var(--foreground)]" dir="rtl">
          {ayah.arabicText}
        </p>
        {ayah.translation && (
          <p className="text-sm text-[var(--text-muted)]">
            {ayah.translation}
          </p>
        )}
      </div>
      
      <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
        <span>Pinned on {ayah.pinnedDate}</span>
        <span>Click to view in context</span>
      </div>
    </div>
  </motion.div>
);

const PinAyahSection = () => {
  // TODO: Replace with actual pinned ayahs from context
  const pinnedAyahs = [
    {
      id: '1',
      surahNumber: 2,
      surahName: 'Al-Baqarah',
      ayahNumber: 255,
      arabicText: 'اللّهُ لاَ إِلَـهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ',
      translation: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep.',
      pinnedDate: 'Jan 15, 2024'
    },
    {
      id: '2',
      surahNumber: 1,
      surahName: 'Al-Fatihah',
      ayahNumber: 1,
      arabicText: 'بِسْمِ اللّهِ الرَّحْمَنِ الرَّحِيْمِ',
      translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
      pinnedDate: 'Jan 14, 2024'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Pin Ayah</h1>
        <p className="text-[var(--text-muted)] mt-1">Your pinned verses for easy access</p>
      </div>
      
      {pinnedAyahs.length > 0 ? (
        <motion.div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <AnimatePresence>
            {pinnedAyahs.map((ayah) => (
              <AyahCard key={ayah.id} ayah={ayah} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center text-[var(--text-muted)] mt-10">
          <p>No pinned ayahs yet.</p>
          <p>Pin verses from any surah to see them here.</p>
        </div>
      )}
    </motion.div>
  );
};

const LastReadCard = ({ reading }: { reading: LastReading }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    className="group cursor-pointer rounded-xl border border-[var(--border-color)] bg-[var(--card-background)] p-4 hover:shadow-md transition transform hover:scale-[1.02]"
    onClick={() => {
      // TODO: Navigate to verse page
      console.log(`Navigate to Surah ${reading.surahNumber}:${reading.lastAyah}`);
    }}
  >
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {reading.surahName}
          </span>
          <span className="text-sm text-[var(--text-muted)]">
            Verse {reading.lastAyah}
          </span>
        </div>
        <span className="text-xs text-[var(--text-muted)]">
          {reading.readDate}
        </span>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-[var(--text-muted)]">
          Progress: {reading.progress}% complete
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${reading.progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
        <span>Last read {reading.timeAgo}</span>
        <span>Click to continue reading</span>
      </div>
    </div>
  </motion.div>
);

const LastReadSection = () => {
  // TODO: Replace with actual last read data from context
  const lastReadings = [
    {
      id: '1',
      surahNumber: 2,
      surahName: 'Al-Baqarah',
      lastAyah: 150,
      progress: 52,
      readDate: 'Jan 15, 2024',
      timeAgo: '2 hours ago'
    },
    {
      id: '2',
      surahNumber: 18,
      surahName: 'Al-Kahf',
      lastAyah: 45,
      progress: 41,
      readDate: 'Jan 14, 2024',
      timeAgo: '1 day ago'
    },
    {
      id: '3',
      surahNumber: 36,
      surahName: 'Ya-Sin',
      lastAyah: 83,
      progress: 100,
      readDate: 'Jan 13, 2024',
      timeAgo: '2 days ago'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Last Read</h1>
        <p className="text-[var(--text-muted)] mt-1">Continue where you left off</p>
      </div>
      
      {lastReadings.length > 0 ? (
        <motion.div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {lastReadings.map((reading) => (
              <LastReadCard key={reading.id} reading={reading} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center text-[var(--text-muted)] mt-10">
          <p>No reading history yet.</p>
          <p>Start reading to see your last read verses here.</p>
        </div>
      )}
    </motion.div>
  );
};

// ===== Main Page Component =====

const BookmarksPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('bookmarks');
  const { folders } = useBookmarks();

  const renderContent = () => {
    switch (activeSection) {
      case 'bookmarks':
        return (
          <BookmarksSection 
            onNewFolderClick={() => setIsModalOpen(true)}
            folders={folders}
            selectedFolderId={selectedFolderId}
            setSelectedFolderId={setSelectedFolderId}
          />
        );
      case 'pin-ayah':
        return <PinAyahSection />;
      case 'last-read':
        return <LastReadSection />;
      default:
        return <BookmarksSection 
          onNewFolderClick={() => setIsModalOpen(true)}
          folders={folders}
          selectedFolderId={selectedFolderId}
          setSelectedFolderId={setSelectedFolderId}
        />;
    }
  };

  return (
    <>
      <CreateFolderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="flex h-full w-full bg-[var(--background)]">
        {/* Collapsible Sidebar */}
        <BookmarkSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}

export default BookmarksPage;
