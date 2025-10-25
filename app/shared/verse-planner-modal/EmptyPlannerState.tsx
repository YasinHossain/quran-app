'use client';

interface EmptyPlannerStateProps {
  verseLabel: string;
}

export function EmptyPlannerState({ verseLabel }: EmptyPlannerStateProps): React.JSX.Element {
  return (
    <div className="rounded-2xl border border-border/70 bg-surface/60 p-8 text-center shadow-inner">
      <p className="text-base font-semibold text-content-primary">No planners yet</p>
      <p className="mt-2 text-sm text-content-secondary">
        Create a planner first to add{' '}
        <span className="font-medium text-content-primary">{verseLabel}</span> into your
        memorization flow.
      </p>
    </div>
  );
}
