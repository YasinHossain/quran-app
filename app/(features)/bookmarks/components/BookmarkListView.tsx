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
          className="rounded-md p-1.5 text-muted hover:bg-gray-200  hover:bg-surface/50"
        >
          <ArrowLeftIcon size={20} />
        </button>
        <h1 className="text-2xl font-bold text-primary ">{folder.name}</h1>
        <span className="text-sm text-muted">{folder.bookmarks.length} bookmarks</span>
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
                className="cursor-pointer rounded-lg border border-gray-200 bg-surface p-4 hover:bg-slate-50 dark:border-gray-700  hover:bg-surface/50"
              >
                {/* For now, just display the verse ID. This will be replaced with actual verse content later. */}
                <p className="font-mono text-sm text-teal-600 dark:text-teal-400">
                  Verse: {bookmark.verseId}
                </p>
                <p className="text-xs text-muted">
                  Bookmarked on: {new Date(bookmark.createdAt).toLocaleDateString()}
                </p>
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 text-center text-muted">
            <p>This folder is empty.</p>
            <p>You can add verses to it from the main reader.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
