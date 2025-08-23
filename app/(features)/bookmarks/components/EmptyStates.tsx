'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, BookmarkIcon } from '@/app/shared/icons';

interface EmptyBookmarksProps {
  onCreateFolder: () => void;
}

export const EmptyBookmarks: React.FC<EmptyBookmarksProps> = ({ onCreateFolder }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 max-w-md mx-auto"
    >
      {/* Icon */}
      <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mx-auto mb-6">
        <BookmarkIcon size={32} className="text-muted" />
      </div>

      {/* Content */}
      <h2 className="text-2xl font-bold text-foreground mb-3">Start Your Journey</h2>
      <p className="text-muted mb-8 leading-relaxed">
        Create your first folder to organize and save your favorite Quran verses. Build a personal
        collection for study, reflection, and memorization.
      </p>

      {/* Actions */}
      <div className="space-y-4">
        <button
          onClick={onCreateFolder}
          className="w-full bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors flex items-center justify-center space-x-2 font-medium"
        >
          <PlusIcon size={20} />
          <span>Create Your First Folder</span>
        </button>

        <div className="pt-4 border-t border-border">
          <h3 className="font-semibold text-foreground mb-3">Quick Start Tips</h3>
          <div className="space-y-2 text-left">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-accent text-sm font-semibold">1</span>
              </div>
              <p className="text-sm text-muted">
                Create folders like &quot;Daily Reading&quot;, &quot;Memorization&quot;, or
                &quot;Reflection&quot;
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-accent text-sm font-semibold">2</span>
              </div>
              <p className="text-sm text-muted">
                Bookmark verses while reading by tapping the bookmark icon
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-accent text-sm font-semibold">3</span>
              </div>
              <p className="text-sm text-muted">
                Access your saved verses anytime from this bookmarks section
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface EmptySearchProps {
  searchTerm: string;
  onClearSearch: () => void;
}

export const EmptySearch: React.FC<EmptySearchProps> = ({ searchTerm, onClearSearch }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 max-w-md mx-auto"
    >
      {/* Icon */}
      <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-foreground mb-2">No Results Found</h3>
      <p className="text-muted mb-6">
        We couldn&apos;t find any folders matching <strong>&quot;{searchTerm}&quot;</strong>
      </p>

      {/* Action */}
      <button
        onClick={onClearSearch}
        className="px-4 py-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
      >
        Clear Search
      </button>
    </motion.div>
  );
};
