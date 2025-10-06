'use client';

import React, { createContext, useContext, useMemo } from 'react';

import { cn } from '@/lib/utils/cn';

interface WorkspaceColumnsContextValue {
  hasLeftSidebar: boolean;
  hasRightSidebar: boolean;
}

const WorkspaceColumnsContext = createContext<WorkspaceColumnsContextValue>({
  hasLeftSidebar: false,
  hasRightSidebar: false,
});

export const useWorkspaceColumns = (): WorkspaceColumnsContextValue =>
  useContext(WorkspaceColumnsContext);

interface ThreeColumnWorkspaceProps {
  left?: React.ReactNode;
  center: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
  leftContainerClassName?: string;
  rightContainerClassName?: string;
  centerContainerClassName?: string;
}

export function ThreeColumnWorkspace({
  left,
  center,
  right,
  className,
  leftContainerClassName,
  rightContainerClassName,
  centerContainerClassName,
}: ThreeColumnWorkspaceProps): React.JSX.Element {
  const hasLeftSidebar = Boolean(left);
  const hasRightSidebar = Boolean(right);

  const workspaceValue = useMemo<WorkspaceColumnsContextValue>(
    () => ({ hasLeftSidebar, hasRightSidebar }),
    [hasLeftSidebar, hasRightSidebar]
  );

  return (
    <WorkspaceColumnsContext.Provider value={workspaceValue}>
      <div
        className={cn(
          'relative flex min-h-screen w-full bg-background text-foreground',
          className
        )}
        data-slot="workspace-root"
      >
        {left ? (
          <aside
            className={cn(
              'hidden lg:flex lg:w-reader-sidebar-left lg:flex-shrink-0 lg:flex-col lg:gap-4',
              'lg:border-r lg:border-border lg:bg-surface',
              leftContainerClassName
            )}
            data-slot="workspace-left"
          >
            {left}
          </aside>
        ) : null}

        <div
          className={cn('flex min-w-0 flex-1 flex-col', centerContainerClassName)}
          data-slot="workspace-center"
        >
          {center}
        </div>

        {right ? (
          <aside
            className={cn(
              'hidden lg:flex lg:w-reader-sidebar-right lg:flex-shrink-0 lg:flex-col lg:gap-4',
              'lg:border-l lg:border-border lg:bg-surface',
              rightContainerClassName
            )}
            data-slot="workspace-right"
          >
            {right}
          </aside>
        ) : null}
      </div>
    </WorkspaceColumnsContext.Provider>
  );
}
