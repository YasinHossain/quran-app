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
  const detailParts = [verseRangeLabel];
  if (estimatedDays && estimatedDays > 0) {
    detailParts.push(`${estimatedDays} day${estimatedDays === 1 ? '' : 's'}`);
  }
  const detailLine = detailParts.join(' · ');

  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full flex-col gap-2 rounded-lg border border-border/20 bg-surface-glass/70 px-4 py-3 text-left text-content-primary shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-border/30 hover:shadow-xl sm:rounded-xl sm:px-5 sm:py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
    >
      <div className="flex flex-col gap-1">
        <span className="text-base font-semibold leading-snug text-content-primary break-words">
          {planName}
        </span>
        <p className="text-sm leading-snug text-muted">{detailLine}</p>
      </div>
    </button>
  );
}
