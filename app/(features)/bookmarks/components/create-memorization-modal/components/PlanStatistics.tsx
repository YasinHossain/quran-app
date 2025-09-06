'use client';

import React from 'react';

interface PlanStatisticsProps {
  isValidRange: boolean;
  totalVerses: number;
  versesPerDay: number;
}

export const PlanStatistics = ({
  isValidRange,
  totalVerses,
  versesPerDay,
}: PlanStatisticsProps): React.JSX.Element | null => {
  if (!isValidRange || totalVerses === 0) return null;

  return (
    <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">Total Verses:</span>
        <span className="font-semibold text-foreground">{totalVerses.toLocaleString()}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">Verses per Day:</span>
        <span className="font-semibold text-accent">{versesPerDay}</span>
      </div>
    </div>
  );
};

