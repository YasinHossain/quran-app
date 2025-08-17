'use client';

import { motion } from 'framer-motion';
import { FolderIcon, PlusIcon, PinIcon, EllipsisHIcon, ArrowLeftIcon } from '@/app/shared/icons';
import type { Folder } from '@/types/bookmark';

// ===== Section Header Component =====
interface CleanSectionHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
  action?: {
    text: string;
    onClick: () => void;
    icon?: React.ComponentType<{ size?: number; className?: string }>;
  };
  variant?: 'folder' | 'pinned' | 'lastRead' | 'general';
}

export const CleanSectionHeader = ({
  title,
  subtitle,
  count,
  action,
  variant = 'folder',
}: CleanSectionHeaderProps) => {
  const getBadgeClass = () => {
    switch (variant) {
      case 'pinned':
        return 'bm-badge-pinned';
      case 'lastRead':
        return 'bm-badge-lastread';
      case 'general':
        return 'bm-badge-general';
      default:
        return 'bm-badge-folder';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bm-section-header"
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="bm-heading text-3xl">{title}</h1>
            {count !== undefined && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className={`bm-badge ${getBadgeClass()}`}
              >
                {count}
              </motion.span>
            )}
          </div>
          {subtitle && (
            <p className="text-gray-600 dark:text-gray-300 font-medium text-lg leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>

        {action && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={action.onClick}
            className="bm-button-primary flex items-center gap-2"
          >
            {action.icon && <action.icon size={16} />}
            {action.text}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

// ===== Folder Card Component =====
interface CleanFolderCardProps {
  name: string;
  count: number;
  onClick: () => void;
  preview?: string[];
  lastModified?: string;
}

export const CleanFolderCard = ({
  name,
  count,
  onClick,
  preview,
  lastModified,
}: CleanFolderCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="bm-card bm-folder-card group"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white dark:bg-teal-900/50 shadow-sm border border-gray-200 dark:border-teal-600">
            <FolderIcon size={24} className="text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h3 className="bm-heading text-lg line-clamp-1">{name}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {count} {count === 1 ? 'bookmark' : 'bookmarks'}
            </p>
          </div>
        </div>

        <button
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full p-2 hover:bg-white/50 dark:hover:bg-gray-800/50"
          onClick={(e) => e.stopPropagation()}
        >
          <EllipsisHIcon size={18} className="text-gray-500 dark:text-gray-300" />
        </button>
      </div>

      {/* Preview */}
      {preview && preview.length > 0 && (
        <div className="mb-4 space-y-1">
          {preview.slice(0, 2).map((text, index) => (
            <div
              key={index}
              className="text-gray-500 dark:text-gray-400 text-sm line-clamp-1 px-2 py-1 bg-white/50 dark:bg-gray-800/50 rounded"
            >
              {text}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {lastModified && (
        <div className="flex items-center justify-between text-xs text-teal-600 dark:text-teal-400">
          <span>Updated {lastModified}</span>
          <motion.div initial={{ x: 0 }} whileHover={{ x: 2 }}>
            →
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

// ===== Bookmark List View Component =====
interface CleanBookmarkListViewProps {
  folder: Folder;
  onBack: () => void;
}

export const CleanBookmarkListView = ({ folder, onBack }: CleanBookmarkListViewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="mb-8">
        <button onClick={onBack} className="bm-button-ghost inline-flex items-center gap-2 mb-6">
          <ArrowLeftIcon size={16} />
          Back to Folders
        </button>

        <CleanSectionHeader
          title={folder.name}
          subtitle="Manage and read your saved verses from this collection."
          count={folder.bookmarks.length}
          variant="general"
        />
      </div>

      <div>
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
                className="bm-card bm-general-card group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="bm-badge bm-badge-general">Verse {bookmark.verseId}</span>
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
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <div className="bm-section text-center">
            <div className="bm-card bg-gray-50 dark:bg-gray-800/50 border-dashed border-gray-300 dark:border-gray-600">
              <div className="py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <FolderIcon size={32} className="text-gray-500 dark:text-gray-300" />
                </div>
                <h3 className="bm-heading text-lg mb-2">This folder is empty</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Start adding verses to this folder while reading. You can bookmark verses by
                  clicking the bookmark icon next to any verse.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
