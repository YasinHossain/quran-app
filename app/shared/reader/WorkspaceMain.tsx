'use client';

import React from 'react';

import { cn } from '@/lib/utils/cn';

import { useWorkspaceColumns } from './ThreeColumnWorkspace';

type WorkspaceMainElement = 'main' | 'div' | 'section';

interface WorkspaceMainProps extends React.HTMLAttributes<HTMLElement> {
  as?: WorkspaceMainElement;
  children: React.ReactNode;
  contentClassName?: string | undefined;
  'data-slot'?: string;
  reserveLeftSpace?: boolean;
  reserveRightSpace?: boolean;
}

export function WorkspaceMain({
  as: Component = 'main',
  children,
  className,
  contentClassName,
  reserveLeftSpace,
  'data-slot': dataSlot,
  reserveRightSpace,
  ...rest
}: WorkspaceMainProps): React.JSX.Element {
  const { isRootHeaderAware, hasLeftSidebar, hasRightSidebar } = useWorkspaceColumns();

  const shouldReserveLeft = Boolean(reserveLeftSpace && !hasLeftSidebar);
  const shouldReserveRight = Boolean(reserveRightSpace && !hasRightSidebar);

  // ARCHITECTURE NOTE:
  // Content scrolls BEHIND the transparent glass header. We use padding (not margin)
  // to offset the initial content position, but scrolling moves content up behind header.
  // The header has backdrop-blur which creates the glass effect over scrolling content.
  const topClass = isRootHeaderAware
    ? null
    : 'pt-[calc(var(--reader-header-height)+var(--reader-safe-area-top))] sm:pt-[calc(var(--reader-header-height)+var(--reader-safe-area-top))]';

  // Body scrolling like Quran.com - content flows naturally, body handles scroll
  // This enables Chrome address bar auto-hide on mobile and consistent scrollbar position
  return (
    <Component
      {...rest}
      data-slot={dataSlot ?? 'workspace-main'}
      className={cn(
        'relative flex flex-1 flex-col text-foreground workspace-main-scroll',
        topClass,
        'pb-safe',
        shouldReserveLeft && 'xl:pl-reader-sidebar-left',
        shouldReserveRight && 'xl:pr-reader-sidebar-right',
        className
      )}
    >
      <div
        className={cn(
          'flex flex-1 flex-col gap-6 px-4 pb-16 pt-6 sm:px-6 sm:pt-8 xl:px-6',
          contentClassName
        )}
      >
        {children}
      </div>
    </Component>
  );
}
