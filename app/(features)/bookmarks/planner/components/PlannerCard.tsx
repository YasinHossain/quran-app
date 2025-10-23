'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Flag, Sparkles, Target } from 'lucide-react';
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
const DEFAULT_ESTIMATED_DAYS = 5;

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
  const startPage = chapter?.pages?.[0];
  const endPage = chapter?.pages?.[1];
  const totalPages =
    typeof startPage === 'number' && typeof endPage === 'number'
      ? Math.max(1, endPage - startPage + 1)
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

  const estimatedDays =
    typeof plan.estimatedDays === 'number' && plan.estimatedDays > 0
      ? plan.estimatedDays
      : DEFAULT_ESTIMATED_DAYS;
  const versesPerDay =
    plan.targetVerses > 0 && estimatedDays > 0
      ? Math.max(1, Math.ceil(plan.targetVerses / estimatedDays))
      : plan.targetVerses;
  const activeDayNumber =
    estimatedDays > 0 && versesPerDay > 0
      ? Math.min(estimatedDays, Math.max(1, Math.floor(plan.completedVerses / versesPerDay) + 1))
      : 1;
  const todaysStartVerse =
    !isComplete && plan.targetVerses > 0
      ? Math.min(plan.targetVerses, Math.max(1, plan.completedVerses + 1))
      : null;
  const todaysEndVerse =
    !isComplete && typeof todaysStartVerse === 'number' && versesPerDay > 0
      ? Math.min(plan.targetVerses, todaysStartVerse + versesPerDay - 1)
      : null;
  const todaysVerseCount =
    typeof todaysStartVerse === 'number' && typeof todaysEndVerse === 'number'
      ? todaysEndVerse - todaysStartVerse + 1
      : 0;

  const getPageForVerse = (verseNumber: number, mode: 'start' | 'end'): number | null => {
    if (typeof startPage !== 'number' || typeof totalPages !== 'number' || totalPages <= 0) {
      return typeof startPage === 'number' ? startPage : null;
    }
    if (plan.targetVerses <= 0) {
      return startPage;
    }
    const clampedVerse = Math.min(Math.max(1, verseNumber), plan.targetVerses);
    const raw =
      mode === 'start'
        ? Math.floor(((clampedVerse - 1) / plan.targetVerses) * totalPages)
        : Math.ceil((clampedVerse / plan.targetVerses) * totalPages) - 1;
    const boundedOffset = Math.max(0, Math.min(totalPages - 1, raw));
    return startPage + boundedOffset;
  };

  const currentPage = getPageForVerse(currentVerse, 'start');
  const currentJuz = typeof currentPage === 'number' ? getJuzByPage(currentPage) : null;

  const todaysStartPage =
    typeof todaysStartVerse === 'number' ? getPageForVerse(todaysStartVerse, 'start') : null;
  const todaysEndPage =
    typeof todaysEndVerse === 'number' ? getPageForVerse(todaysEndVerse, 'end') : null;
  const todaysStartJuz =
    typeof todaysStartPage === 'number' ? getJuzByPage(todaysStartPage) : null;
  const todaysEndJuz =
    typeof todaysEndPage === 'number' ? getJuzByPage(todaysEndPage) : todaysStartJuz;
  const hasDailyGoal =
    typeof todaysStartVerse === 'number' &&
    typeof todaysEndVerse === 'number' &&
    todaysEndVerse >= todaysStartVerse;
  const remainingDays =
    !isComplete && versesPerDay > 0
      ? Math.max(0, Math.ceil(remainingVerses / versesPerDay))
      : 0;
  const projectedCompletionDate =
    remainingDays > 0 ? new Date(Date.now() + remainingDays * DAY_IN_MS) : null;
  const projectedCompletionLabel =
    projectedCompletionDate !== null
      ? projectedCompletionDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      : null;
  const currentSecondaryParts: string[] = [];
  if (typeof currentPage === 'number') currentSecondaryParts.push(`Page ${currentPage}`);
  if (typeof currentJuz === 'number') currentSecondaryParts.push(`Juz ${currentJuz}`);
  const currentSecondaryText = currentSecondaryParts.join(' • ');

  const goalVerseLabel =
    hasDailyGoal && typeof todaysStartVerse === 'number' && typeof todaysEndVerse === 'number'
      ? todaysStartVerse === todaysEndVerse
        ? `${surahLabel} ${surahId}:${todaysStartVerse}`
        : `${surahLabel} ${surahId}:${todaysStartVerse} to ${surahLabel} ${surahId}:${todaysEndVerse}`
      : 'All daily goals completed';
  const goalPageLabel =
    typeof todaysStartPage === 'number' && typeof todaysEndPage === 'number'
      ? todaysStartPage === todaysEndPage
        ? `Page ${todaysStartPage}`
        : `Pages ${todaysStartPage}-${todaysEndPage}`
      : null;
  const goalJuzLabel =
    typeof todaysStartJuz === 'number' && typeof todaysEndJuz === 'number'
      ? todaysStartJuz === todaysEndJuz
        ? `Juz ${todaysStartJuz}`
        : `Juz ${todaysStartJuz}-${todaysEndJuz}`
      : null;
  const dailyHighlights = hasDailyGoal
    ? [
        {
          label: 'Verses today',
          value:
            todaysVerseCount > 0
              ? `${todaysVerseCount} verse${todaysVerseCount === 1 ? '' : 's'}`
              : null,
        },
        { label: 'Pages', value: goalPageLabel },
        { label: 'Juz', value: goalJuzLabel },
      ].filter(
        (highlight): highlight is { label: string; value: string } => Boolean(highlight.value),
      )
    : [];
  const dayLabel = isComplete
    ? `Completed in ${estimatedDays} day${estimatedDays === 1 ? '' : 's'}`
    : `Day ${activeDayNumber} of ${estimatedDays}`;
  const remainingDaysLabel = isComplete
    ? 'Completed'
    : remainingDays <= 0
      ? 'Due today'
      : remainingDays === 1
        ? '1 day'
        : `${remainingDays} days`;
  const endsAtValue = !isComplete && projectedCompletionLabel ? projectedCompletionLabel : '—';
  const remainingSummary = hasDailyGoal ? `Remaining ${remainingDaysLabel}` : null;
  const endsAtSummary = hasDailyGoal ? `Ends at ${endsAtValue}` : null;

  const handleNavigate = (): void => {
    router.push(`/surah/${surahId}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter') {
      handleNavigate();
    }
  };

  const handleContinueClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    handleNavigate();
  };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={`Continue memorizing ${chapter?.name_simple || `Surah ${surahId}`} - ${percent}% complete`}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-surface p-6 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 sm:p-7"
    >
      <div className="relative z-10 flex h-full flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex min-w-0 flex-col gap-4">
            <div className="space-y-2 text-left">
              <h2 className="text-2xl font-semibold text-foreground">{planName}</h2>
            </div>
          </div>

          <div className="relative flex w-full min-w-[280px] flex-1 flex-col gap-3">
            <div className="rounded-2xl border border-border/60 bg-background/60 px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-semibold text-foreground">
                <span className="inline-flex items-center gap-2 text-muted">
                  <Target className="h-4 w-4 text-accent" />
                  Today&apos;s focus
                </span>
                <span className="text-xs font-semibold text-muted">{dayLabel}</span>
              </div>
              {hasDailyGoal ? (
                <>
                  <div className="mt-4 space-y-1 text-left">
                    <p className="text-base font-semibold text-foreground sm:text-lg">
                      {goalVerseLabel}
                    </p>
                  </div>
                  {dailyHighlights.length > 0 && (
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      {dailyHighlights.map((highlight) => (
                        <div
                          key={highlight.label}
                          className="rounded-xl border border-border/50 bg-surface/80 p-3"
                        >
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                            {highlight.label}
                          </p>
                          <p className="mt-2 text-sm font-semibold text-foreground">
                            {highlight.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  {(remainingSummary || endsAtSummary) && (
                    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted sm:text-sm">
                      {remainingSummary && (
                        <span className="font-semibold text-foreground">{remainingSummary}</span>
                      )}
                      {remainingSummary && endsAtSummary && <span className="text-muted">•</span>}
                      {endsAtSummary && (
                        <span className="font-semibold text-foreground">{endsAtSummary}</span>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="mt-4 rounded-xl bg-surface/80 px-3 py-3 text-sm text-muted">
                  All daily goals completed. Keep revisiting for retention.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-5">
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

        <div className="mt-auto">
          <div className="rounded-2xl border border-border/60 bg-background/60 px-4 py-4">
            <div className="flex items-center justify-between text-sm font-semibold text-foreground">
              <span className="inline-flex items-center gap-2 text-muted">
                <Sparkles className="h-4 w-4 text-accent" />
                Currently at
              </span>
              <span className="text-xs font-semibold text-muted">{percent}%</span>
            </div>
            <div className="mt-2">
              <p className="text-base font-semibold text-foreground sm:text-lg">
                {surahLabel} {surahId}:{currentVerse}
              </p>
              {currentSecondaryText && (
                <p className="mt-0.5 text-xs text-muted sm:text-sm">{currentSecondaryText}</p>
              )}
            </div>
            <div
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border/40 shadow-inner"
            >
              <motion.div
                className="h-full rounded-full bg-accent"
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ type: 'spring', stiffness: 160, damping: 24 }}
              />
            </div>
            <button
              type="button"
              onClick={handleContinueClick}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-on-accent shadow-sm transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Continue reading
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
