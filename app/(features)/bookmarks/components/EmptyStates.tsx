'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { BookmarkIcon, PlusIcon } from '@/app/shared/icons';

import { SearchIcon, SearchContent, SearchActions } from './empty-states';

interface EmptySearchProps {
  searchTerm: string;
  onClearSearch: () => void;
}

export const EmptyBookmarks = (): React.JSX.Element => {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
        <BookmarkIcon className="w-8 h-8 text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No Bookmark Folders</h3>
      <p className="text-muted max-w-md mx-auto mb-6">
        Create your first folder to start organizing your favorite verses.
      </p>
      <button className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-on-accent rounded-xl font-semibold hover:bg-accent-hover transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
        <PlusIcon size={20} />
        Create Bookmark Folder
      </button>
    </div>
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
