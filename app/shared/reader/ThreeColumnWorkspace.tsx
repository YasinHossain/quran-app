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
  // ARCHITECTURE NOTE:
  // We explicitly set isRootHeaderAware to false and remove padding from the root container.
  // This allows the center content (WorkspaceMain) to scroll BEHIND the transparent glass header.
  // Sidebars use MARGIN (not padding) to position themselves below the header.
  // This ensures the entire sidebar (including background/borders) moves/slides with the header.
  const { isHidden } = useHeaderVisibility();
  const hasLeftSidebar = Boolean(left);
  const hasRightSidebar = Boolean(right);

  const sidebarMarginClass = isHidden
    ? 'mt-[calc(var(--reader-safe-area-top))]'
    : 'mt-[calc(var(--reader-header-height)+var(--reader-safe-area-top))]';

  const sidebarHeightClass = isHidden
    ? 'h-[calc(100dvh-var(--reader-safe-area-top))]'
    : 'h-[calc(100dvh-var(--reader-header-height)-var(--reader-safe-area-top))]';

  const workspaceValue = useMemo<WorkspaceColumnsContextValue>(
    () => ({
      hasLeftSidebar,
      hasRightSidebar,
      isRootHeaderAware: false,
    }),
    [hasLeftSidebar, hasRightSidebar]
  );

  return (
    <WorkspaceColumnsContext.Provider value={workspaceValue}>
      <div
        className={cn(
          'relative flex h-[100dvh] w-full bg-background text-foreground',
          className
        )}
        data-slot="workspace-root"
      >
        {left ? (
          <aside
            className={cn(
              'hidden lg:flex lg:w-reader-sidebar-left lg:flex-shrink-0 lg:flex-col lg:gap-4',
              'lg:relative lg:z-10',
              'workspace-sidebar-left',
              'transition-all duration-300',
              sidebarMarginClass,
              sidebarHeightClass,
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
              'hidden xl:flex xl:w-reader-sidebar-right xl:flex-shrink-0 xl:flex-col xl:gap-4',
              'xl:relative xl:z-10',
              'workspace-sidebar-right',
              'transition-all duration-300',
              sidebarMarginClass,
              sidebarHeightClass,
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
