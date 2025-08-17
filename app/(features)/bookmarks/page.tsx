'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { FolderIcon, EllipsisHIcon, PlusIcon, PinIcon } from '@/app/shared/icons';
import { CreateFolderModal } from './components/CreateFolderModal';
import { BookmarkListView } from './components/BookmarkListView';
import BookmarkSidebar from './components/BookmarkSidebar';
import {
  EmptyBookmarksState,
  EmptyFolderState,
  EmptyPinnedState,
  EmptyLastReadState
} from './components/EmptyStates';
import {
  CleanSectionHeader,
  CleanFolderCard,
  CleanBookmarkListView
} from './components/CleanBookmarkComponents';
import type { Folder } from '@/types/bookmark';

// ===== Enhanced Card Components =====

const BookmarksSection = ({ onNewFolderClick, folders, selectedFolderId, setSelectedFolderId }: {
  onNewFolderClick: () => void;
  folders: Folder[];
  selectedFolderId: string | null;
  setSelectedFolderId: (id: string | null) => void;
}) => {
  const selectedFolder = useMemo(() => {
    if (!selectedFolderId) return null;
    return folders.find(f => f.id === selectedFolderId) || null;
  }, [selectedFolderId, folders]);

  return (
    <AnimatePresence mode="wait">
      {selectedFolder ? (
        <CleanBookmarkListView
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
          <CleanSectionHeader
            title="Bookmarks"
            subtitle="Organize your favorite verses into folders for easy access and study."
            count={folders.length}
            action={{
              text: "New Folder",
              onClick: onNewFolderClick,
              icon: PlusIcon
            }}
            variant="folder"
          />
          
          {folders.length === 0 ? (
            <EmptyBookmarksState onCreateFolder={onNewFolderClick} />
          ) : (
            <motion.div 
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AnimatePresence>
                {folders.map((folder, index) => (
                  <CleanFolderCard
                    key={folder.id}
                    name={folder.name}
                    count={folder.bookmarks.length}
                    onClick={() => setSelectedFolderId(folder.id)}
                    preview={folder.bookmarks.slice(0, 2).map(b => `Verse ${b.verseId}`)}
                    lastModified={"2 days ago"}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
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
    className="group cursor-pointer rounded-2xl border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 p-6 hover:shadow-xl hover:border-amber-300 dark:hover:border-amber-600 transition-all duration-200 transform hover:scale-[1.02]"
    onClick={() => {
      // TODO: Navigate to verse page
      console.log(`Navigate to Surah ${ayah.surahNumber}:${ayah.ayahNumber}`);
    }}
  >
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="rounded-lg bg-amber-200 dark:bg-amber-800/50 px-3 py-1.5 text-sm font-medium text-amber-800 dark:text-amber-200">
            {ayah.surahName}
          </span>
          <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">
            Verse {ayah.ayahNumber}
          </span>
        </div>
        <button className="rounded-full p-2 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors">
          <PinIcon size={18} />
        </button>
      </div>
      
      <div className="space-y-3">
        <p className="text-right text-xl leading-relaxed text-gray-900 dark:text-white font-arabic" dir="rtl">
          {ayah.arabicText}
        </p>
        {ayah.translation && (
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
            {ayah.translation}
          </p>
        )}
      </div>
      
      <div className="flex items-center justify-between text-xs text-amber-600 dark:text-amber-400">
        <span>Pinned {ayah.pinnedDate}</span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
          Click to view in context →
        </span>
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
      <CleanSectionHeader
        title="Pinned Verses"
        subtitle="Quick access to your most important and frequently referenced verses."
        count={pinnedAyahs.length}
        variant="pinned"
      />
      
      {pinnedAyahs.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence>
            {pinnedAyahs.map((ayah) => (
              <AyahCard key={ayah.id} ayah={ayah} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <EmptyPinnedState />
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
    className="group cursor-pointer rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-6 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 transform hover:scale-[1.02]"
    onClick={() => {
      // TODO: Navigate to verse page
      console.log(`Navigate to Surah ${reading.surahNumber}:${reading.lastAyah}`);
    }}
  >
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="rounded-lg bg-indigo-200 dark:bg-indigo-800/50 px-3 py-1.5 text-sm font-medium text-indigo-800 dark:text-indigo-200">
            {reading.surahName}
          </span>
          <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
            Verse {reading.lastAyah}
          </span>
        </div>
        <span className="text-xs text-indigo-500 dark:text-indigo-400 bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded">
          {reading.readDate}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Reading Progress
          </span>
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
            {reading.progress}%
          </span>
        </div>
        <div className="w-full bg-white/60 dark:bg-gray-800/60 rounded-full h-3 overflow-hidden">
          <motion.div 
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full" 
            initial={{ width: 0 }}
            animate={{ width: `${reading.progress}%` }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400">
        <span>Last read {reading.timeAgo}</span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
          Continue reading →
        </span>
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
      <CleanSectionHeader
        title="Reading History"
        subtitle="Pick up where you left off and track your Quranic reading progress."
        count={lastReadings.length}
        variant="lastRead"
      />
      
      {lastReadings.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence>
            {lastReadings.map((reading) => (
              <LastReadCard key={reading.id} reading={reading} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <EmptyLastReadState />
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
      <div className="bookmark-page flex h-full w-full">
        {/* Collapsible Sidebar */}
        <BookmarkSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Main Content Area */}
        <main className="bookmark-main-content p-8">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}

export default BookmarksPage;
