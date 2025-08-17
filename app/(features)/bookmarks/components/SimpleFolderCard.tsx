'use client';

import { motion } from 'framer-motion';
import { FolderIcon, EllipsisHIcon } from '@/app/shared/icons';

interface SimpleFolderCardProps {
  name: string;
  count: number;
  onClick: () => void;
  preview?: string[];
  lastModified?: string;
}

export const SimpleFolderCard = ({
  name,
  count,
  onClick,
  preview,
  lastModified,
}: SimpleFolderCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="group relative cursor-pointer rounded-2xl border-2 border-teal-200 dark:border-teal-700 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-800/30 dark:to-teal-700/30 p-6 hover:shadow-xl hover:border-teal-300 dark:hover:border-teal-500 transition-all duration-200"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-surface dark:bg-teal-900/50 shadow-sm border border-gray-200 dark:border-teal-600">
            <FolderIcon size={24} className="text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary  line-clamp-1">{name}</h3>
            <p className="text-sm text-muted ">
              {count} {count === 1 ? 'bookmark' : 'bookmarks'}
            </p>
          </div>
        </div>

        <button
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full p-2 hover:bg-surface/50 hover:bg-surface/50"
          onClick={(e) => e.stopPropagation()}
        >
          <EllipsisHIcon size={18} className="text-muted " />
        </button>
      </div>

      {/* Preview */}
      {preview && preview.length > 0 && (
        <div className="mb-4 space-y-1">
          {preview.slice(0, 2).map((text, index) => (
            <div
              key={index}
              className="text-xs text-muted  line-clamp-1 px-2 py-1 bg-surface/50  rounded"
            >
              {text}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {lastModified && (
        <div className="flex items-center justify-between text-xs text-muted ">
          <span>Updated {lastModified}</span>
          <motion.div
            initial={{ x: 0 }}
            whileHover={{ x: 2 }}
            className="text-teal-600 dark:text-teal-400"
          >
            →
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
