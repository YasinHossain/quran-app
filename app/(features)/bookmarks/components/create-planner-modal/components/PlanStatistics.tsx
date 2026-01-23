'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { formatNumber } from '@/lib/text/localizeNumbers';

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
  const { t, i18n } = useTranslation();
  if (!isValidRange || totalVerses === 0) return null;

  return (
    <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">{t('planner_total_verses')}:</span>
        <span className="font-semibold text-foreground">
          {formatNumber(totalVerses, i18n.language)}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">{t('planner_verses_per_day')}:</span>
        <span className="font-semibold text-accent">
          {formatNumber(versesPerDay, i18n.language, { useGrouping: false })}
        </span>
      </div>
    </div>
  );
};
