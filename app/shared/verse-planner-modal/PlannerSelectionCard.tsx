'use client';

import React from 'react';

interface PlannerSelectionCardProps {
  id: string;
  planName: string;
  verseRangeLabel: string;
  estimatedDays?: number;
  onSelect?: () => void;
}

export function PlannerSelectionCard({
  planName,
  verseRangeLabel,
  estimatedDays,
  onSelect,
}: PlannerSelectionCardProps): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full flex-col gap-1 rounded-2xl border border-border/60 bg-surface/90 px-3.5 py-2.5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/60 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
    >
      <span className="text-base font-semibold text-content-primary leading-tight">{planName}</span>
      <span className="text-sm text-content-secondary">
        {verseRangeLabel} · {estimatedDays ?? '—'} days
      </span>
    </button>
  );
}

