'use client';

import { motion } from 'framer-motion';
import React from 'react';

import {
  BookmarkIllustration,
  EmptyBookmarksContent,
  PrimaryAction,
  QuickStartGuide,
  SearchIcon,
  SearchContent,
  SearchActions,
  FADE_UP_VARIANTS,
} from './empty-states';

interface EmptyBookmarksProps {
  onCreateFolder: () => void;
}

interface EmptySearchProps {
  searchTerm: string;
  onClearSearch: () => void;
}

export const EmptyBookmarks = ({ onCreateFolder }: EmptyBookmarksProps): React.JSX.Element => {
  return (
    <motion.div
      variants={FADE_UP_VARIANTS}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="text-center py-20 max-w-2xl mx-auto"
    >
      <BookmarkIllustration />
      <EmptyBookmarksContent />
      <PrimaryAction onCreateFolder={onCreateFolder} />
      <QuickStartGuide />
    </motion.div>
  );
};

export const EmptySearch = ({ searchTerm, onClearSearch }: EmptySearchProps): React.JSX.Element => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="text-center py-20 max-w-lg mx-auto"
    >
      <SearchIcon />
      <SearchContent searchTerm={searchTerm} />
      <SearchActions onClearSearch={onClearSearch} />
    </motion.div>
  );
};
