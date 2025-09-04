'use client';

import type React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CircularProgress } from '../../components/CircularProgress';
import { Chapter } from '@/types';

interface LastReadCardProps {
  surahId: string;
  verseId: number;
  chapter?: Chapter;
  index: number;
}

export const LastReadCard: React.FC<LastReadCardProps> = ({
  surahId,
  verseId,
  chapter,
  index,
}) => {
  const router = useRouter();
  const total = chapter?.verses_count || 0;
  const percent = Math.min(100, Math.max(0, Math.round((verseId / total) * 100)));

  const handleNavigate = () => {
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
      className="w-[calc(50%-0.5rem)] sm:w-72 lg:w-80 h-80 bg-surface rounded-2xl shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-600 hover:shadow-xl transition-all duration-300 border border-border/50 p-6 text-center flex flex-col items-center justify-between"
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex-1 flex items-center justify-center">
        <CircularProgress percentage={percent} label="Complete" size={160} strokeWidth={15} />
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
