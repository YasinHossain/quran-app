'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { PlusIcon, BookmarkIcon, CheckIcon } from '@/app/shared/icons';

import { SCALE_VARIANTS } from './animations';

// Illustration component for EmptyBookmarks
export const BookmarkIllustration = (): React.JSX.Element => (
  <div className="relative mb-8">
    <motion.div
      variants={SCALE_VARIANTS}
      initial="initial"
      animate="animate"
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
);

// Main content for EmptyBookmarks
export const EmptyBookmarksContent = (): React.JSX.Element => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3, duration: 0.5 }}
  >
    <h2 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
      Start Your Spiritual Journey
    </h2>
    <p className="text-lg text-muted mb-10 leading-relaxed max-w-md mx-auto">
      Create folders to organize and save your favorite Quran verses. Build a personal collection
      for study, reflection, and memorization.
    </p>
  </motion.div>
);

// Primary action button for EmptyBookmarks
interface PrimaryActionProps {
  onCreateFolder: () => void;
}

export const PrimaryAction = ({ onCreateFolder }: PrimaryActionProps): React.JSX.Element => (
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
);

// Guide step component
interface GuideStepProps {
  step: number;
  title: string;
  description: string;
}

const GuideStep = ({ step, title, description }: GuideStepProps): React.JSX.Element => (
  <div className="flex flex-col items-center text-center">
    <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center mb-4">
      <span className="text-accent text-lg font-bold">{step}</span>
    </div>
    <div className="font-semibold text-foreground mb-2">{title}</div>
    <p className="text-sm text-muted leading-relaxed">{description}</p>
  </div>
);

// Quick start guide section
export const QuickStartGuide = (): React.JSX.Element => (
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
      <GuideStep
        step={1}
        title="Create Folders"
        description='Organize with themes like "Daily Reading", "Memorization", or "Reflection"'
      />
      <GuideStep
        step={2}
        title="Save Verses"
        description="Bookmark verses while reading by tapping the bookmark icon"
      />
      <GuideStep
        step={3}
        title="Easy Access"
        description="Find your saved verses anytime in this bookmarks section"
      />
    </div>
  </motion.div>
);
