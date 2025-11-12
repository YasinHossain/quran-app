'use client';

import React, { createContext, useContext, useMemo } from 'react';

import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { cn } from '@/lib/utils/cn';

interface WorkspaceColumnsContextValue {
  hasLeftSidebar: boolean;
  hasRightSidebar: boolean;
  isRootHeaderAware: boolean;
}

const WorkspaceColumnsContext = createContext<WorkspaceColumnsContextValue>({
  hasLeftSidebar: false,
  hasRightSidebar: false,
  isRootHeaderAware: false,
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
  const { isHidden } = useHeaderVisibility();
  const hasLeftSidebar = Boolean(left);
  const hasRightSidebar = Boolean(right);

  const headerOffsetClass = isHidden
    ? 'pt-[calc(var(--reader-safe-area-top))]'
    : 'pt-[calc(var(--reader-header-height)+var(--reader-safe-area-top))]';

  const workspaceValue = useMemo<WorkspaceColumnsContextValue>(
    () => ({
      hasLeftSidebar,
      hasRightSidebar,
      isRootHeaderAware: true,
    }),
    [hasLeftSidebar, hasRightSidebar]
  );

  return (
    <WorkspaceColumnsContext.Provider value={workspaceValue}>
      <div
        className={cn(
          'relative flex h-[100dvh] w-full bg-background text-foreground',
          headerOffsetClass,
          className
        )}
        data-slot="workspace-root"
      >
        {left ? (
          <aside
            className={cn(
              'hidden lg:flex lg:h-full lg:w-reader-sidebar-left lg:flex-shrink-0 lg:flex-col lg:gap-4',
              'lg:relative lg:z-10',
              'workspace-sidebar-left',
              leftContainerClassName
            )}
            data-slot="workspace-left"
          >
            {left}
          </aside>
        ) : null}

        <div
          className={cn('flex min-h-0 min-w-0 flex-1 flex-col', centerContainerClassName)}
          data-slot="workspace-center"
        >
          {center}
        </div>

        {right ? (
          <aside
            className={cn(
              'hidden lg:flex lg:h-full lg:w-reader-sidebar-right lg:flex-shrink-0 lg:flex-col lg:gap-4',
              'lg:relative lg:z-10',
              'workspace-sidebar-right',
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
