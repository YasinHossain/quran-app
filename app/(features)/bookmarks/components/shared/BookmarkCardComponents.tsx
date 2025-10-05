import { motion } from 'framer-motion';
import React from 'react';

export const LoadingFallback = (): React.JSX.Element => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-xl bg-surface border border-border p-6 mb-6"
  >
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-surface-hover rounded w-32"></div>
        <div className="h-3 bg-surface-hover rounded w-20"></div>
      </div>
      <div className="space-y-3">
        <div className="h-6 bg-surface-hover rounded"></div>
        <div className="h-4 bg-surface-hover rounded w-3/4"></div>
      </div>
    </div>
  </motion.div>
);

interface ErrorFallbackProps {
  error: unknown;
  verseId: string;
}

export const ErrorFallback = ({ error, verseId }: ErrorFallbackProps): React.JSX.Element => (
  <motion.div
    role="alert"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-xl bg-surface border border-error/20 p-6 mb-6"
  >
    <div className="text-error text-center">
      <p>Failed to load verse: {String(error)}</p>
      <p className="text-sm text-muted mt-2">Verse ID: {verseId}</p>
    </div>
  </motion.div>
);
