'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { localizeDigits } from '@/lib/text/localizeNumbers';

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
  const { t, i18n } = useTranslation();
  const localizedPlanName = localizeDigits(planName, i18n.language);
  const localizedVerseRangeLabel = localizeDigits(verseRangeLabel, i18n.language);

  const detailParts = [localizedVerseRangeLabel];
  if (estimatedDays && estimatedDays > 0) {
    const rounded = Math.round(estimatedDays);
    detailParts.push(
      rounded === 1
        ? t('planner_one_day', { count: rounded })
        : t('planner_n_days', { count: rounded })
    );
  }
  const detailLine = detailParts.join(' · ');

  const composedClassName = [
    'flex w-full flex-col gap-2 rounded-lg border px-4 py-4 text-left transition-colors duration-200 sm:px-5 sm:py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 group',
    isSelected
      ? 'border-accent bg-accent text-on-accent'
      : 'border-border bg-surface text-content-primary hover:bg-interactive-hover',
  ].join(' ');

  const titleClassName = isSelected
    ? 'text-base font-semibold leading-snug text-on-accent break-words'
    : 'text-base font-semibold leading-snug text-content-primary break-words group-hover:text-accent transition-colors';

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
        <span className={titleClassName}>{localizedPlanName}</span>
        <p className={detailClassName}>{detailLine}</p>
      </div>
    </button>
  );
}
