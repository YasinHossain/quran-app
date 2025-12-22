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
  /** When true, uses body scrolling for touch mobile (enables Chrome address bar auto-hide) */
  isTouchMobile?: boolean;
}

export function ThreeColumnWorkspace({
  left,
  center,
  right,
  className,
  leftContainerClassName,
  rightContainerClassName,
  centerContainerClassName,
  isTouchMobile = false,
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

  // On touch mobile, use min-height instead of fixed height so body can scroll
  // This enables Chrome's address bar auto-hide on mobile phones
  const rootHeightClass = isTouchMobile
    ? 'min-h-[100dvh]'
    : 'h-[100dvh]';

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
        className={cn('relative flex w-full bg-background text-foreground', rootHeightClass, className)}
        data-slot="workspace-root"
      >
        {left ? (
          <aside
            className={cn(
              'hidden xl:flex xl:w-reader-sidebar-left xl:flex-shrink-0 xl:flex-col xl:gap-4',
              'xl:relative xl:z-10',
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
              'hidden 2xl:flex 2xl:w-reader-sidebar-right 2xl:flex-shrink-0 2xl:flex-col 2xl:gap-4',
              '2xl:relative 2xl:z-10',
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

