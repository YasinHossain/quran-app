'use client';

import { Folder } from '@/types';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@/app/shared/icons';

interface BookmarkListViewProps {
  folder: Folder;
  onBack: () => void;
}

export const BookmarkListView = ({ folder, onBack }: BookmarkListViewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={onBack}
          className="rounded-md p-1.5 text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          <ArrowLeftIcon size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{folder.name}</h1>
        <span className="text-sm text-gray-500">
          {folder.bookmarks.length} bookmarks
        </span>
      </div>

      <div>
        {folder.bookmarks.length > 0 ? (
          <ul className="space-y-3">
            {folder.bookmarks.map((bookmark, index) => (
              <motion.li
                key={bookmark.verseId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700/50"
              >
                {/* For now, just display the verse ID. This will be replaced with actual verse content later. */}
                <p className="font-mono text-sm text-teal-600 dark:text-teal-400">
                  Verse: {bookmark.verseId}
                </p>
                <p className="text-xs text-gray-400">
                  Bookmarked on: {new Date(bookmark.createdAt).toLocaleDateString()}
                </p>
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 text-center text-gray-500">
            <p>This folder is empty.</p>
            <p>You can add verses to it from the main reader.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
