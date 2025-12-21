'use client';

interface EmptyPlannerStateProps {
  verseLabel: string;
}

export function EmptyPlannerState({ verseLabel }: EmptyPlannerStateProps): React.JSX.Element {
  return (
    <div className="rounded-lg border border-border bg-surface p-8 text-center">
      <p className="text-base font-semibold text-content-primary">No planners yet</p>
      <p className="mt-2 text-sm text-content-secondary">
        Create a planner first to add{' '}
        <span className="font-medium text-content-primary">{verseLabel}</span> into your plan.
      </p>
    </div>
  );
}
