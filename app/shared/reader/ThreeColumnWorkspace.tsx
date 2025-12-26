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
  // ARCHITECTURE NOTE for Body Scrolling (like Quran.com):
  // - The page uses body scrolling, so scrollbar is on the right edge of browser
  // - Sidebars use `position: fixed` to stay in place while main content scrolls
  // - Header slides up/down based on scroll direction
  const { isHidden } = useHeaderVisibility();
  const hasLeftSidebar = Boolean(left);
  const hasRightSidebar = Boolean(right);

  // Sidebar positioning: fixed with top offset based on header visibility
  const sidebarTopClass = isHidden
    ? 'top-[var(--reader-safe-area-top)]'
    : 'top-[calc(var(--reader-header-height)+var(--reader-safe-area-top))]';

  // Sidebar height: viewport minus header (when visible) and safe area
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
        className={cn('relative flex w-full bg-background text-foreground workspace-root-height', className)}
        data-slot="workspace-root"
      >
        {/* Fixed Left Sidebar - positioned after the 64px icon sidebar */}
        {left ? (
          <aside
            className={cn(
              'hidden xl:flex xl:w-reader-sidebar-left xl:flex-col xl:gap-4',
              'xl:fixed xl:left-16 xl:z-10',
              'workspace-sidebar-left',
              'transition-all duration-300',
              sidebarTopClass,
              sidebarHeightClass,
              leftContainerClassName
            )}
            data-slot="workspace-left"
          >
            {left}
          </aside>
        ) : null}

        {/* Main content area - reserves space for fixed sidebars and icon sidebar */}
        <div
          className={cn(
            'flex min-w-0 flex-1 flex-col',
            // Account for icon sidebar (64px) + left sidebar on xl screens
            hasLeftSidebar && 'xl:ml-[var(--reader-sidebar-width-left)]',
            hasRightSidebar && '2xl:mr-reader-sidebar-right',
            centerContainerClassName
          )}
          data-slot="workspace-center"
        >
          {center}
        </div>

        {/* Fixed Right Sidebar - TEMPORARILY CENTERED FOR DEBUGGING */}
        {right ? (
          <aside
            className={cn(
              'hidden 2xl:flex 2xl:w-reader-sidebar-right 2xl:flex-col 2xl:gap-4',
              '2xl:fixed 2xl:right-0 2xl:z-10',
              'workspace-sidebar-right',
              'transition-all duration-300',
              sidebarTopClass,
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
