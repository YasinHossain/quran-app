'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { SCALE_VARIANTS } from './animations';

// Search icon component
export const SearchIcon = (): React.JSX.Element => (
  <motion.div
    variants={SCALE_VARIANTS}
    initial="initial"
    animate="animate"
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
);

// Search content
interface SearchContentProps {
  searchTerm: string;
}

export const SearchContent = ({ searchTerm }: SearchContentProps): React.JSX.Element => (
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
);

// Search actions
interface SearchActionsProps {
  onClearSearch: () => void;
}

export const SearchActions = ({ onClearSearch }: SearchActionsProps): React.JSX.Element => (
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
);
