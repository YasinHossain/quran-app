import React from 'react';

import { TargetIcon } from '@/app/shared/icons';

import type { PlannerCardViewModel } from '@/app/(features)/bookmarks/planner/utils/plannerCard';

interface DailyFocusSectionProps {
  focus: PlannerCardViewModel['focus'];
}

const DailyGoalDetails = ({ focus }: DailyFocusSectionProps): React.JSX.Element => (
  <>
    <div className="mt-4 space-y-3">
      <div className="flex h-full w-full items-center justify-center rounded-xl border border-border/50 bg-surface/80 p-3 text-center sm:col-span-3 sm:p-4">
        <p className="text-sm font-semibold text-foreground sm:text-base">{focus.goalVerseLabel}</p>
      </div>
      {focus.dailyHighlights.length > 0 && (
        <div className="grid min-w-0 gap-3 @[420px]:grid-cols-2 @[560px]:grid-cols-3">
          {focus.dailyHighlights.map((highlight) => (
            <div
              key={highlight.label}
              className="flex h-full min-w-0 items-center justify-center rounded-xl border border-border/50 bg-surface/80 p-2 text-center sm:p-3"
            >
              <p className="text-xs font-semibold text-foreground sm:text-sm break-words">{highlight.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
    {(focus.remainingSummary || focus.endsAtSummary) && (
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted sm:text-sm">
        {focus.remainingSummary && (
          <span className="font-semibold text-foreground">{focus.remainingSummary}</span>
        )}
        {focus.remainingSummary && focus.endsAtSummary && <span className="text-muted">•</span>}
        {focus.endsAtSummary && (
          <span className="font-semibold text-foreground">{focus.endsAtSummary}</span>
        )}
      </div>
    )}
  </>
);

export const DailyFocusSection = ({ focus }: DailyFocusSectionProps): React.JSX.Element => (
  <div className="relative flex w-full min-w-0 flex-1 basis-[14rem] flex-col gap-3">
    <div className="rounded-2xl border border-border/60 bg-background/60 px-4 py-3 sm:py-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-semibold text-foreground">
        <span className="inline-flex items-center gap-2 text-muted">
          <TargetIcon className="h-4 w-4 shrink-0 text-accent" />
          Today&apos;s focus
        </span>
        <span className="text-xs font-semibold text-muted">{focus.dayLabel}</span>
      </div>
      {focus.hasDailyGoal ? (
        <DailyGoalDetails focus={focus} />
      ) : (
        <div className="mt-4 rounded-xl bg-surface/80 px-3 py-3 text-sm text-muted">
          {focus.noGoalMessage}
        </div>
      )}
    </div>
  </div>
);
