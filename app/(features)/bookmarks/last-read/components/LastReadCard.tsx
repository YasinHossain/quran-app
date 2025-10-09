'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React from 'react';

import { CircularProgress } from '@/app/(features)/bookmarks/components/CircularProgress';
import { Chapter } from '@/types';

interface LastReadCardProps {
  surahId: string;
  verseId: number;
  chapter?: Chapter;
  index: number;
}

export const LastReadCard = ({
  surahId,
  verseId,
  chapter,
  index,
}: LastReadCardProps): React.JSX.Element => {
  const router = useRouter();
  const total = chapter?.verses_count || 0;
  const percent = Math.min(100, Math.max(0, Math.round((verseId / total) * 100)));

  const handleNavigate = (): void => {
    router.push(`/surah/${surahId}#verse-${verseId}`);
  };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={`Continue reading ${chapter?.name_simple || `Surah ${surahId}`} at verse ${verseId}`}
      onClick={handleNavigate}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleNavigate();
        }
      }}
      className="group flex h-full min-h-[20rem] w-full flex-col items-center justify-between rounded-2xl border border-border/50 bg-surface p-6 text-center shadow-lg transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-accent sm:p-7 lg:p-8"
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex w-full flex-1 items-center justify-center">
        <CircularProgress percentage={percent} label="Complete" size={140} strokeWidth={15} />
      </div>
      <div className="mt-4">
        <p className="text-lg font-bold text-foreground truncate">
          {chapter?.name_simple || `Surah ${surahId}`}
        </p>
        <p className="text-sm text-muted mt-1">
          Verse {verseId} of {total}
        </p>
      </div>
    </motion.div>
  );
};
