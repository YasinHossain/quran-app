'use client';

import React from 'react';

interface PlannerSelectionCardProps {
  id: string;
  planName: string;
  verseRangeLabel: string;
  estimatedDays?: number;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function PlannerSelectionCard({
  planName,
  verseRangeLabel,
  estimatedDays,
  isSelected = false,
  onSelect,
}: PlannerSelectionCardProps): React.JSX.Element {
  const detailParts = [verseRangeLabel];
  if (estimatedDays && estimatedDays > 0) {
    detailParts.push(`${estimatedDays} day${estimatedDays === 1 ? '' : 's'}`);
  }
  const detailLine = detailParts.join(' · ');

  const composedClassName = [
    'flex w-full flex-col gap-2 rounded-xl border px-4 py-3 text-left transition-all duration-300 sm:px-5 sm:py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 backdrop-blur-sm',
    isSelected
      ? 'border-accent/50 bg-accent text-on-accent shadow-lg shadow-accent/30'
      : 'border-border/40 bg-surface/80 text-content-primary shadow-sm backdrop-blur-sm hover:-translate-y-1 hover:shadow-lg hover:border-border/30',
  ].join(' ');

  const titleClassName = isSelected
    ? 'text-base font-semibold leading-snug text-on-accent break-words'
    : 'text-base font-semibold leading-snug text-content-primary break-words';

  const detailClassName = isSelected
    ? 'text-sm leading-snug text-on-accent/80'
    : 'text-sm leading-snug text-muted/80';

  return (
    <button
      type="button"
      onClick={onSelect}
      className={composedClassName}
      aria-pressed={isSelected}
    >
      <div className="flex flex-col gap-1">
        <span className={titleClassName}>{planName}</span>
        <p className={detailClassName}>{detailLine}</p>
      </div>
    </button>
  );
}
