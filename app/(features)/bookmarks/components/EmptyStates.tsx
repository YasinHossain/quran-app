'use client';

import { motion } from 'framer-motion';
import { FolderIcon, BookmarkIcon, PinIcon, ClockIcon, PlusIcon } from '@/app/shared/icons';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  actionText?: string;
  onAction?: () => void;
  illustration?: React.ReactNode;
}

const EmptyStateBase = ({
  title,
  description,
  icon: Icon,
  actionText,
  onAction,
  illustration,
}: EmptyStateProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    className="flex flex-col items-center justify-center py-16 px-6 text-center"
  >
    {/* Illustration */}
    <div className="mb-8">
      {illustration || (
        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/20 dark:to-teal-800/20 flex items-center justify-center mb-4"
          >
            <Icon size={40} className="text-teal-600 dark:text-teal-400" />
          </motion.div>
          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-yellow-200 dark:bg-yellow-600/30"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="absolute -bottom-1 -left-3 w-4 h-4 rounded-full bg-blue-200 dark:bg-blue-600/30"
          />
        </div>
      )}
    </div>

    {/* Content */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="max-w-md"
    >
      <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3">{title}</h3>
      <p className="text-muted leading-relaxed mb-6">{description}</p>
    </motion.div>

    {/* Action Button */}
    {actionText && onAction && (
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        onClick={onAction}
        className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
      >
        <PlusIcon size={18} />
        {actionText}
      </motion.button>
    )}
  </motion.div>
);

export const EmptyBookmarksState = ({ onCreateFolder }: { onCreateFolder: () => void }) => (
  <EmptyStateBase
    title="No bookmark folders yet"
    description="Create your first folder to start organizing your favorite verses. You can categorize verses by themes, study topics, or personal preferences."
    icon={FolderIcon}
    actionText="Create Your First Folder"
    onAction={onCreateFolder}
    illustration={
      <div className="relative">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-24 bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/20 dark:to-teal-800/20 rounded-lg flex items-center justify-center shadow-lg"
        >
          <FolderIcon size={32} className="text-teal-600 dark:text-teal-400" />
        </motion.div>
        <motion.div
          initial={{ scale: 0, rotate: 10 }}
          animate={{ scale: 1, rotate: 5 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="absolute -right-6 top-2 w-16 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg flex items-center justify-center shadow-md opacity-70"
        >
          <BookmarkIcon size={24} className="text-blue-600 dark:text-blue-400" />
        </motion.div>
        {/* Floating particles */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute -top-3 left-2 w-2 h-2 bg-yellow-400 rounded-full"
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute -bottom-2 right-2 w-1.5 h-1.5 bg-pink-400 rounded-full"
        />
      </div>
    }
  />
);

export const EmptyFolderState = () => (
  <EmptyStateBase
    title="This folder is empty"
    description="Start adding verses to this folder while reading. You can bookmark verses by clicking the bookmark icon next to any verse."
    icon={BookmarkIcon}
    illustration={
      <div className="relative">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600"
        >
          <BookmarkIcon size={32} className="text-gray-400 dark:text-gray-500" />
        </motion.div>
        {/* Plus indicator */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
          className="absolute -bottom-2 -right-2 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white shadow-lg"
        >
          <PlusIcon size={16} />
        </motion.div>
      </div>
    }
  />
);

export const EmptyPinnedState = () => (
  <EmptyStateBase
    title="No pinned verses yet"
    description="Pin your favorite verses for quick access. Pinned verses appear here and can be accessed from anywhere in the app."
    icon={PinIcon}
    illustration={
      <div className="relative">
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-32 bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-900/20 dark:to-amber-800/20 rounded-t-lg rounded-b-sm shadow-lg relative"
        >
          {/* Note lines */}
          <div className="absolute top-8 left-3 right-3 space-y-2">
            <div className="h-0.5 bg-amber-300 dark:bg-amber-600 rounded opacity-60" />
            <div className="h-0.5 bg-amber-300 dark:bg-amber-600 rounded opacity-40" />
            <div className="h-0.5 bg-amber-300 dark:bg-amber-600 rounded opacity-20" />
          </div>
        </motion.div>
        <motion.div
          initial={{ scale: 0, rotate: 45 }}
          animate={{ scale: 1, rotate: 25 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
          className="absolute -top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-md"
        >
          <PinIcon size={16} className="text-white transform -rotate-25" />
        </motion.div>
      </div>
    }
  />
);

export const EmptyLastReadState = () => (
  <EmptyStateBase
    title="No reading history yet"
    description="Start reading to track your progress. Your reading history will appear here, making it easy to continue where you left off."
    icon={ClockIcon}
    illustration={
      <div className="relative">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/20 dark:to-indigo-800/20 flex items-center justify-center border-4 border-indigo-200 dark:border-indigo-800"
        >
          <ClockIcon size={32} className="text-indigo-600 dark:text-indigo-400" />
        </motion.div>
        {/* Clock hands animation */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 w-0.5 h-6 bg-indigo-600 dark:bg-indigo-400 origin-bottom transform -translate-x-0.5 -translate-y-6"
        />
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 30 }}
          transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 w-0.5 h-4 bg-indigo-800 dark:bg-indigo-300 origin-bottom transform -translate-x-0.5 -translate-y-4"
        />
      </div>
    }
  />
);
