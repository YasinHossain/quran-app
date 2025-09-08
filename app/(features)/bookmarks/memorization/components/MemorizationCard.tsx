'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React from 'react';

import { MemorizationPlan } from '@/types';

import { CircularProgress } from '../../components/CircularProgress';

interface MemorizationCardProps {
  surahId: string;
  plan: MemorizationPlan;
  chapter?: {
    name_simple: string;
    name_arabic: string;
  };
}

interface CardHeaderProps {
  chapter?: {
    name_simple: string;
    name_arabic: string;
  };
  surahId: string;
  percent: number;
}

interface ProgressDetailsProps {
  plan: MemorizationPlan;
  percent: number;
}

interface StatusFooterProps {
  plan: MemorizationPlan;
  percent: number;
}

const CardHeader = ({ chapter, surahId, percent }: CardHeaderProps): React.JSX.Element => (
  <div className="flex flex-col items-center text-center mb-4">
    <div className="mb-4">
      <CircularProgress percentage={percent} label="Completed" size={100} strokeWidth={10} />
    </div>

    <div className="mb-3">
      <h3 className="text-lg font-bold text-foreground truncate mb-1">
        {chapter?.name_simple || `Surah ${surahId}`}
      </h3>
      <p className="text-sm text-muted truncate">{chapter?.name_arabic}</p>
    </div>
  </div>
);

const ProgressDetails = ({ plan, percent }: ProgressDetailsProps): React.JSX.Element => (
  <div className="flex-1 space-y-3 text-center">
    <div className="bg-accent/5 rounded-lg p-3">
      <div className="flex items-center justify-center gap-2 text-sm mb-2">
        <div className="w-2 h-2 bg-accent rounded-full"></div>
        <span className="text-muted">Progress:</span>
        <span className="font-semibold text-foreground">
          {plan.completedVerses} / {plan.targetVerses}
        </span>
      </div>

      <div className="text-xs text-muted space-y-1">
        <div>From 1:1 - 1:{plan.completedVerses > 0 ? plan.completedVerses : 1}</div>
        <div>Now: Verse {Math.min(plan.completedVerses + 1, plan.targetVerses)}</div>
      </div>
    </div>

    <div className="flex items-center justify-between">
      <div className="text-left">
        <div className="text-xl font-bold text-accent">{percent}%</div>
        <div className="text-xs text-muted">Complete</div>
      </div>

      <div className="inline-flex items-center px-3 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium">
        <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></div>5 Days Left
      </div>
    </div>
  </div>
);

const StatusFooter = ({ plan }: StatusFooterProps): React.JSX.Element => (
  <div className="text-xs text-muted pt-2 border-t border-border/50">
    {plan.completedVerses === plan.targetVerses ? 'Completed' : 'In Progress'} • Started{' '}
    {new Date(plan.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })}
  </div>
);

export const MemorizationCard = ({
  surahId,
  plan,
  chapter,
}: MemorizationCardProps): React.JSX.Element => {
  const router = useRouter();
  const percent = Math.min(
    100,
    Math.max(0, Math.round((plan.completedVerses / plan.targetVerses) * 100))
  );

  const handleNavigate = (): void => {
    router.push(`/surah/${surahId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleNavigate();
    }
  };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={`Continue memorizing ${chapter?.name_simple || `Surah ${surahId}`} - ${percent}% complete`}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      className="bg-surface rounded-2xl shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent hover:shadow-xl transition-all duration-300 border border-border/50 p-4 sm:p-6 
      hover:border-accent/20 flex flex-col h-full relative z-10"
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: parseInt(surahId) * 0.1 }}
    >
      <CardHeader chapter={chapter} surahId={surahId} percent={percent} />
      <ProgressDetails plan={plan} percent={percent} />
      <StatusFooter plan={plan} percent={percent} />
    </motion.div>
  );
};
