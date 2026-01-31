'use client';

import { motion } from 'framer-motion';
import React, { memo } from 'react';

interface FolderProgressProps {
  bookmarkCount: number;
}

export const FolderProgress = memo(function FolderProgress({
  bookmarkCount,
}: FolderProgressProps): React.JSX.Element {
  return (
    <div>
      <div className="w-full h-1.5 bg-surface-hover rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: bookmarkCount > 0 ? '100%' : '25%' }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full"
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted">
        <span>
          {bookmarkCount > 0 ? `Last added ${new Date().toLocaleDateString()}` : 'Empty folder'}
        </span>
      </div>
    </div>
  );
});
