'use client';

import { Folder } from '@/types';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@/app/shared/icons';
import { EmptyFolderState } from './EmptyStates';
import { SimpleSectionHeader } from './SimpleSectionHeader';

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
      <div className="mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 mb-6 px-3 py-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeftIcon size={16} />
          Back to Folders
        </button>
        
        <SimpleSectionHeader
          title={folder.name}
          subtitle={`Manage and read your saved verses from this collection.`}
          count={folder.bookmarks.length}
          variant="folder"
        />
      </div>

      <div className="space-y-6">
        {folder.bookmarks.length > 0 ? (
          <motion.ul 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {folder.bookmarks.map((bookmark, index) => (
              <motion.li
                key={bookmark.verseId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group cursor-pointer rounded-xl border-2 border-emerald-200 dark:border-emerald-700 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-800/20 dark:to-emerald-700/20 p-6 hover:border-emerald-300 dark:hover:border-emerald-500 hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-200 dark:bg-emerald-800/50 text-emerald-800 dark:text-emerald-200">
                      Verse {bookmark.verseId}
                    </span>
                  </div>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-white/50 dark:bg-emerald-900/30 px-2 py-1 rounded">
                    {new Date(bookmark.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                {/* Placeholder content - will be replaced with actual verse content */}
                <div className="space-y-2">
                  <div className="h-4 bg-emerald-200 dark:bg-emerald-800/30 rounded animate-pulse" />
                  <div className="h-3 bg-emerald-100 dark:bg-emerald-900/20 rounded animate-pulse w-3/4" />
                </div>
                
                <div className="mt-4 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400">
                  <span>Click to view in context</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <EmptyFolderState />
        )}
      </div>
    </motion.div>
  );
};
