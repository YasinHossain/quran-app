import React from 'react';

import { CheckCircleIcon, FlagIcon, TargetIcon, type IconProps } from '@/app/shared/icons';

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
  if (value === null || value === undefined) return null;

  return (
    <div className="text-lg font-semibold text-foreground break-words">
      {value}
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
  <div className="flex min-w-0 flex-col rounded-2xl border border-border/60 bg-background/60 px-4 py-4 shadow-sm">
    <div className="inline-flex items-center gap-2 text-sm font-semibold text-muted">
      <Icon className="h-4 w-4 shrink-0 text-accent" />
      {title}
    </div>
    <div className="mt-3 space-y-1">
      <SecondaryStat value={stats.verses} unit="verses" />
      <SecondaryStat value={stats.pages} unit="pages" />
      <SecondaryStat value={stats.juz} unit="juz" />
    </div>
  </div>
);

export const PlannerStatsSection = ({ stats }: PlannerStatsSectionProps): React.JSX.Element => (
  <div className="grid gap-5">
    {/* Use container queries so layout adapts to card width, not viewport */}
    <div className="grid min-w-0 gap-3 [@container(min-width:22rem)]:grid-cols-3">
      <StatsCard title="Completed" icon={CheckCircleIcon} stats={stats.completed} />
      <StatsCard title="Remaining" icon={FlagIcon} stats={stats.remaining} />
      <StatsCard title="Goal" icon={TargetIcon} stats={stats.goal} />
    </div>
  </div>
);
