'use client';

import { motion } from 'framer-motion';
import { CalendarClock, CheckCircle2, Clock3, Flag, Sparkles, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import { getJuzByPage } from '@/lib/utils/surah-navigation';
import { PlannerPlan } from '@/types';

interface PlannerCardProps {
  surahId: string;
  plan: PlannerPlan;
  chapter?:
    | {
        name_simple: string;
        name_arabic: string;
        pages?: [number, number];
      }
    | undefined;
}

const DAY_IN_MS = 1000 * 60 * 60 * 24;

const getRelativeTimeLabel = (timestamp: number): string => {
  if (!timestamp) return 'Just now';

  const now = Date.now();
  const diff = now - timestamp;

  if (diff <= 0) return 'Just now';

  const dayDiff = Math.floor(diff / DAY_IN_MS);

  if (dayDiff <= 0) return 'Today';
  if (dayDiff === 1) return 'Yesterday';
  if (dayDiff < 7) return `${dayDiff} days ago`;

  const weekDiff = Math.floor(dayDiff / 7);
  if (weekDiff === 1) return '1 week ago';
  if (weekDiff < 5) return `${weekDiff} weeks ago`;

  const monthDiff = Math.floor(dayDiff / 30);
  if (monthDiff <= 1) return '1 month ago';
  if (monthDiff < 12) return `${monthDiff} months ago`;

  const yearDiff = Math.floor(dayDiff / 365);
  return yearDiff === 1 ? '1 year ago' : `${yearDiff} years ago`;
};

const SecondaryStat = ({
  value,
  unit,
}: {
  value: number | string | null;
  unit: string;
}): React.JSX.Element | null => {
  if (value === null || value === undefined) return null;

  return (
    <div className="text-lg font-semibold text-foreground">
      {value}
      <span className="ml-1 text-xs font-medium text-muted">{unit}</span>
    </div>
  );
};

export const PlannerCard = ({
  surahId,
  plan,
  chapter,
}: PlannerCardProps): React.JSX.Element => {
  const router = useRouter();
  const percent = plan.targetVerses
    ? Math.min(100, Math.max(0, Math.round((plan.completedVerses / plan.targetVerses) * 100)))
    : 0;
  const remainingVerses = Math.max(plan.targetVerses - plan.completedVerses, 0);
  const currentVerse =
    plan.targetVerses > 0 ? Math.min(plan.completedVerses + 1, plan.targetVerses) : 1;
  const planName = plan.notes?.trim() ? plan.notes.trim() : `Plan for Surah ${surahId}`;
  const surahLabel = chapter?.name_simple || `Surah ${surahId}`;
  const isComplete = percent >= 100;
  const status = isComplete
    ? 'Completed'
    : plan.completedVerses === 0
      ? 'Getting started'
      : 'In progress';
  const startedOn = new Date(plan.createdAt);
  const startedLabel = startedOn.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const lastUpdatedLabel = getRelativeTimeLabel(plan.lastUpdated);
  const lastUpdatedTitle = new Date(plan.lastUpdated).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const daysActive = Math.max(1, Math.ceil((Date.now() - plan.createdAt) / DAY_IN_MS));
  const activeLabel = daysActive <= 1 ? 'Day 1' : `${daysActive} days in`;
  const statusClasses =
    isComplete
      ? 'inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-on-accent shadow-sm'
      : 'inline-flex items-center gap-1 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent';
  const statusIconClasses =
    isComplete ? 'h-3 w-3 flex-shrink-0 text-on-accent' : 'h-3 w-3 flex-shrink-0 text-accent';
  const upNextLabel = isComplete
    ? 'Plan ready for revision'
    : `Up next • Verse ${currentVerse} of ${plan.targetVerses}`;
  const upNextClasses = isComplete
    ? 'inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-on-accent shadow-sm'
    : 'inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1.5 text-sm font-semibold text-accent';
  const upNextIconClasses = isComplete ? 'h-4 w-4 text-on-accent' : 'h-4 w-4 text-accent';
  const totalPages =
    Array.isArray(chapter?.pages) && chapter.pages.length >= 2
      ? Math.max(1, (chapter.pages[1] ?? 0) - (chapter.pages[0] ?? 0) + 1)
      : null;
  const computePagesFromVerses = (verses: number): number | null => {
    if (!totalPages || plan.targetVerses <= 0) return null;
    if (verses <= 0) return 0;
    const ratio = verses / plan.targetVerses;
    const estimated = Math.round(ratio * totalPages);
    return Math.max(0, Math.min(totalPages, estimated));
  };
  const completedPages = computePagesFromVerses(plan.completedVerses);
  const remainingPages =
    totalPages !== null && completedPages !== null
      ? Math.max(totalPages - completedPages, 0)
      : totalPages;
  const goalPages = totalPages;
  const completedPagesCount = typeof completedPages === 'number' ? completedPages : null;
  const remainingPagesCount =
    typeof remainingPages === 'number' ? Math.max(0, remainingPages) : null;
  const goalPagesCount = typeof goalPages === 'number' ? Math.max(0, goalPages) : null;

  const startPage = chapter?.pages?.[0];
  const endPage = chapter?.pages?.[1];
  const startJuz = typeof startPage === 'number' ? getJuzByPage(startPage) : null;
  const endJuz = typeof endPage === 'number' ? getJuzByPage(endPage) : null;
  const totalJuzCount =
    startJuz && endJuz
      ? Math.max(1, endJuz - startJuz + 1)
      : startJuz
        ? 1
        : null;
  const computeJuzCountFromVerses = (verses: number): number | null => {
    if (totalJuzCount === null) return null;
    if (plan.targetVerses <= 0) return 0;
    if (verses <= 0) return 0;
    const ratio = Math.min(1, Math.max(0, verses / plan.targetVerses));
    return Math.max(0, Math.min(totalJuzCount, Math.round(ratio * totalJuzCount)));
  };
  const completedJuzCount = computeJuzCountFromVerses(plan.completedVerses);
  const remainingJuzCount =
    totalJuzCount !== null && completedJuzCount !== null
      ? Math.max(totalJuzCount - completedJuzCount, 0)
      : null;
  const goalJuzCount = totalJuzCount;

  const handleNavigate = (): void => {
    router.push(`/surah/${surahId}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter') {
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
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-surface p-6 shadow-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 hover:-translate-y-1 hover:border-accent/40 hover:shadow-2xl sm:p-7"
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: parseInt(surahId, 10) * 0.1 }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -right-16 -top-20 h-44 w-44 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -left-14 bottom-0 h-36 w-36 rounded-full bg-primary/15 blur-3xl" />
      </div>

      <div className="relative z-10 flex h-full flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex min-w-0 flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
              <span className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 font-semibold text-accent">
                <Sparkles className="h-3.5 w-3.5" />
                Planner
              </span>
              <span className={statusClasses}>
                <CheckCircle2 className={statusIconClasses} />
                {status}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border/60 px-2.5 py-1 text-muted">
                <Clock3 className="h-3.5 w-3.5 text-accent" />
                {activeLabel}
              </span>
            </div>

            <div className="space-y-2 text-left">
              <h2 className="text-2xl font-semibold text-foreground">{planName}</h2>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
                <span className="inline-flex items-center gap-1 rounded-full border border-border/60 px-2.5 py-1">
                  <Flag className="h-3 w-3 text-accent" />
                  Surah {surahId}
                </span>
                <span className="font-medium text-foreground">{surahLabel}</span>
              </div>
              {chapter?.name_arabic && (
                <p className="text-sm font-medium text-primary">{chapter.name_arabic}</p>
              )}
            </div>
          </div>

          <div className="relative flex w-full flex-col gap-3">
            <div className="w-full rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
              <div className="flex items-center justify-between text-sm font-medium text-foreground">
                <span className="text-muted">Progress</span>
                <span>{percent}%</span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface/80"
              >
                <motion.div
                  className="h-full rounded-full bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ type: 'spring', stiffness: 160, damping: 24 }}
                />
              </div>
              <p className="mt-3 text-sm text-muted">
                {plan.completedVerses} of {plan.targetVerses} verses complete
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="rounded-2xl border border-border/60 bg-background/70 p-4 shadow-inner">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-medium text-foreground">
              <span className="inline-flex items-center gap-2 text-muted">
                <Sparkles className="h-4 w-4 text-accent" />
                Current focus
              </span>
              <span className="text-sm font-semibold text-foreground">
                {isComplete ? 'All verses completed' : `Resume at verse ${currentVerse}`}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted">
              {isComplete
                ? 'Great work! Revisit the surah to reinforce your memorization.'
                : 'Continue from your last memorized ayah to keep the momentum.'}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border/50 bg-surface/80 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                Completed
              </div>
              <div className="mt-2">
                <SecondaryStat value={plan.completedVerses} unit="verses" />
              </div>
              <div className="mt-3 space-y-2">
                <SecondaryStat value={completedPagesCount} unit="pages" />
                <SecondaryStat value={completedJuzCount} unit="juz" />
              </div>
            </div>

            <div className="rounded-xl border border-border/50 bg-surface/80 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
                <Flag className="h-3.5 w-3.5 text-accent" />
                Remaining
              </div>
              <div className="mt-2">
                <SecondaryStat value={remainingVerses} unit="verses" />
              </div>
              <div className="mt-3 space-y-2">
                <SecondaryStat value={remainingPagesCount} unit="pages" />
                <SecondaryStat value={remainingJuzCount} unit="juz" />
              </div>
            </div>

            <div className="rounded-xl border border-border/50 bg-surface/80 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
                <Target className="h-3.5 w-3.5 text-accent" />
                Goal
              </div>
              <div className="mt-2">
                <SecondaryStat value={plan.targetVerses} unit="verses" />
              </div>
              <div className="mt-3 space-y-2">
                <SecondaryStat value={goalPagesCount} unit="pages" />
                <SecondaryStat value={goalJuzCount} unit="juz" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-sm text-muted">
          <span className="inline-flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-accent" />
            Started {startedLabel}
          </span>
          <span className="inline-flex items-center gap-2" title={lastUpdatedTitle}>
            <Clock3 className="h-4 w-4 text-accent" />
            Last review • {lastUpdatedLabel}
          </span>
          <span className={upNextClasses}>
            <Sparkles className={upNextIconClasses} />
            {upNextLabel}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
