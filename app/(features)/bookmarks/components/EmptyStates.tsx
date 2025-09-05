'use client';

import { motion } from 'framer-motion';

import { PlusIcon, BookmarkIcon, CheckIcon } from '@/app/shared/icons';

interface EmptyBookmarksProps {
  onCreateFolder: () => void;
}

export const EmptyBookmarks = ({ onCreateFolder }: EmptyBookmarksProps): JSX.Element => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="text-center py-20 max-w-2xl mx-auto"
    >
      {/* Illustration */}
      <div className="relative mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-32 h-32 bg-gradient-to-br from-accent/20 to-accent/5 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg"
        >
          <BookmarkIcon size={48} className="text-accent" />
        </motion.div>

        {/* Floating elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="absolute -top-2 -right-4 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center"
        >
          <CheckIcon size={16} className="text-accent" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="absolute -bottom-2 -left-4 w-6 h-6 bg-accent/20 rounded-full"
        />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
          Start Your Spiritual Journey
        </h2>
        <p className="text-lg text-muted mb-10 leading-relaxed max-w-md mx-auto">
          Create folders to organize and save your favorite Quran verses. Build a personal
          collection for study, reflection, and memorization.
        </p>
      </motion.div>

      {/* Primary Action */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mb-10"
      >
        <button
          onClick={onCreateFolder}
          className="group bg-accent text-white px-8 py-4 rounded-2xl hover:bg-accent/90 transition-all duration-300 flex items-center justify-center space-x-3 font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 mx-auto"
        >
          <PlusIcon size={24} className="group-hover:scale-110 transition-transform duration-200" />
          <span>Create Your First Folder</span>
        </button>
      </motion.div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="bg-surface border border-border rounded-2xl p-8 shadow-sm"
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <CheckIcon size={20} className="text-accent" />
          <h3 className="font-bold text-foreground text-lg">Quick Start Guide</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center mb-4">
              <span className="text-accent text-lg font-bold">1</span>
            </div>
            <div className="font-semibold text-foreground mb-2">Create Folders</div>
            <p className="text-sm text-muted leading-relaxed">
              Organize with themes like &quot;Daily Reading&quot;, &quot;Memorization&quot;, or
              &quot;Reflection&quot;
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center mb-4">
              <span className="text-accent text-lg font-bold">2</span>
            </div>
            <div className="font-semibold text-foreground mb-2">Save Verses</div>
            <p className="text-sm text-muted leading-relaxed">
              Bookmark verses while reading by tapping the bookmark icon
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center mb-4">
              <span className="text-accent text-lg font-bold">3</span>
            </div>
            <div className="font-semibold text-foreground mb-2">Easy Access</div>
            <p className="text-sm text-muted leading-relaxed">
              Find your saved verses anytime in this bookmarks section
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

interface EmptySearchProps {
  searchTerm: string;
  onClearSearch: () => void;
}

export const EmptySearch = ({ searchTerm, onClearSearch }: EmptySearchProps): JSX.Element => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="text-center py-20 max-w-lg mx-auto"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="w-20 h-20 bg-gradient-to-br from-muted/20 to-muted/5 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm"
      >
        <svg className="w-10 h-10 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <h3 className="text-2xl font-bold text-foreground mb-3">No Results Found</h3>
        <div className="space-y-2 mb-8">
          <p className="text-muted text-base">We couldn&apos;t find any folders matching</p>
          <p className="px-4 py-2 bg-surface border border-border rounded-xl inline-block font-mono text-sm text-foreground">
            &quot;{searchTerm}&quot;
          </p>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="space-y-4"
      >
        <button
          onClick={onClearSearch}
          className="bg-accent text-white px-6 py-3 rounded-xl hover:bg-accent/90 transition-all duration-200 font-semibold hover:-translate-y-0.5 shadow-sm hover:shadow-md"
        >
          Clear Search
        </button>

        <div className="text-sm text-muted">
          <p>Try adjusting your search terms or browse all folders</p>
        </div>
      </motion.div>
    </motion.div>
  );
};
