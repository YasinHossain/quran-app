'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { VerseCard as VerseComponent } from '@/app/(features)/surah/components';
import type { Verse as VerseType } from '@/types';
import { Spinner } from '@/app/shared/Spinner';

interface BookmarkVerseListProps {
  verses: VerseType[];
  isLoading: boolean;
  error: string | null;
  searchTerm?: string;
}

export const BookmarkVerseList = ({
  verses,
  isLoading,
  error,
  searchTerm = '',
}: BookmarkVerseListProps) => {
  return (
    <div className="w-full relative">
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8 text-accent" />
        </div>
      ) : error ? (
        <div className="text-center py-20 text-status-error bg-status-error/10 p-4 rounded-lg">
          {error}
        </div>
      ) : verses.length > 0 ? (
        <div className="space-y-0">
          {verses.map((verse) => (
            <motion.div
              key={verse.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <VerseComponent verse={verse} />
            </motion.div>
          ))}
        </div>
      ) : searchTerm ? (
        <div className="text-center py-20 text-muted">
          No verses found matching &quot;{searchTerm}&quot;
        </div>
      ) : (
        <div className="text-center py-20 text-muted">No verses in this folder</div>
      )}
    </div>
  );
};

