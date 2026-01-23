import React from 'react';
import { useTranslation } from 'react-i18next';

import { CheckCircleIcon, FlagIcon, TargetIcon, type IconProps } from '@/app/shared/icons';
import { formatNumber, localizeDigits } from '@/lib/text/localizeNumbers';

import type {
  PlannerCardViewModel,
  PlannerStatsGroup,
} from '@/app/(features)/bookmarks/planner/utils/plannerCard';

interface PlannerStatsSectionProps {
  stats: PlannerCardViewModel['stats'];
}

const SecondaryStat = ({
  value,
  unit,
}: {
  value: number | string | null;
  unit: string;
}): React.JSX.Element | null => {
  const { i18n } = useTranslation();
  if (value === null || value === undefined) return null;
  const displayValue =
    typeof value === 'number'
      ? formatNumber(value, i18n.language, { useGrouping: false })
      : localizeDigits(String(value), i18n.language);

  return (
    <div className="text-lg font-semibold text-foreground break-words">
      {displayValue}
      <span className="ml-1 text-xs font-medium text-muted">{unit}</span>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  icon: (props: IconProps) => React.JSX.Element;
  stats: PlannerStatsGroup;
}

const StatsCard = ({ title, icon: Icon, stats }: StatsCardProps): React.JSX.Element => (
  <StatsCardInner title={title} icon={Icon} stats={stats} />
);

const StatsCardInner = ({ title, icon: Icon, stats }: StatsCardProps): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="flex min-w-0 flex-col rounded-lg border border-border/60 bg-background/60 px-4 py-4 shadow-sm">
      <div className="inline-flex items-center gap-2 text-sm font-semibold text-muted">
        <Icon className="h-4 w-4 shrink-0 text-accent" />
        {title}
      </div>
      <div className="mt-3 space-y-1">
        <SecondaryStat value={stats.verses} unit={t('verses')} />
        <SecondaryStat value={stats.pages} unit={t('pages')} />
        <SecondaryStat value={stats.juz} unit={t('juz')} />
      </div>
    </div>
  );
};

export const PlannerStatsSection = ({ stats }: PlannerStatsSectionProps): React.JSX.Element => (
  <PlannerStatsSectionInner stats={stats} />
);

const PlannerStatsSectionInner = ({ stats }: PlannerStatsSectionProps): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="grid gap-5">
      {/* Use container queries so layout adapts to card width, not viewport */}
      <div className="grid min-w-0 gap-3 [@container(min-width:22rem)]:grid-cols-3">
        <StatsCard title={t('completed')} icon={CheckCircleIcon} stats={stats.completed} />
        <StatsCard title={t('remaining')} icon={FlagIcon} stats={stats.remaining} />
        <StatsCard title={t('goal')} icon={TargetIcon} stats={stats.goal} />
      </div>
    </div>
  );
};
