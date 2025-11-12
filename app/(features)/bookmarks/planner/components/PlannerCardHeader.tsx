import React from 'react';

interface PlannerCardHeaderProps {
  displayPlanName: string;
  planDetailsText: string | null;
}

export const PlannerCardHeader = ({
  displayPlanName,
  planDetailsText,
}: PlannerCardHeaderProps): React.JSX.Element => (
  <div className="flex min-w-0 flex-col gap-4">
    <div className="space-y-2 text-left">
      <h2 className="text-2xl font-semibold text-foreground break-words">{displayPlanName}</h2>
      {planDetailsText && <p className="text-sm text-muted break-words">{planDetailsText}</p>}
    </div>
  </div>
);
