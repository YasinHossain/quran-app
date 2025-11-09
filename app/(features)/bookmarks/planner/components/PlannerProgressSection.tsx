import React from 'react';

import { SparklesIcon } from '@/app/shared/icons';

import type { PlannerCardViewModel } from '@/app/(features)/bookmarks/planner/utils/plannerCard';

interface PlannerProgressSectionProps {
  progress: PlannerCardViewModel['progress'];
  surahLabel: string;
  surahId: string;
  currentVerseLabel?: string;
  onContinue: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const PlannerProgressSection = ({
  progress,
  surahLabel,
  surahId,
  currentVerseLabel,
  onContinue,
}: PlannerProgressSectionProps): React.JSX.Element => {
  const verseLine =
    typeof currentVerseLabel === 'string' && currentVerseLabel.length > 0
      ? currentVerseLabel
      : `${surahLabel} ${surahId}:${progress.currentVerse}`;

  return (
    <div className="rounded-2xl border border-border/60 bg-background/60 px-4 py-4">
      <div className="flex items-center justify-between text-sm font-semibold text-foreground">
        <span className="inline-flex items-center gap-2 text-muted">
          <SparklesIcon className="h-4 w-4 shrink-0 text-accent" />
          Currently at
        </span>
        <span className="text-xs font-semibold text-muted">{progress.percent}%</span>
      </div>
      <div className="mt-2">
        <p className="mb-1 text-base font-semibold leading-tight text-foreground [@container(min-width:22rem)]:text-lg break-words">
          {verseLine}
        </p>
        {progress.currentSecondaryText && (
          <p className="mt-0 text-xs text-muted [@container(min-width:22rem)]:text-sm">
            {progress.currentSecondaryText}
          </p>
        )}
      </div>
      <div
        role="progressbar"
        aria-valuenow={progress.percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border/40 shadow-inner"
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
      <button
        type="button"
        onClick={onContinue}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-on-accent shadow-sm transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Continue reading
      </button>
    </div>
  );
};
