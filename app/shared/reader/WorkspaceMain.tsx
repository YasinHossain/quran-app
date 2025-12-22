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
  /** When true, uses body scrolling for touch mobile (enables Chrome address bar auto-hide) */
  isTouchMobile?: boolean;
}

export function WorkspaceMain({
  as: Component = 'main',
  children,
  className,
  contentClassName,
  reserveLeftSpace,
  'data-slot': dataSlot,
  reserveRightSpace,
  isTouchMobile = false,
  ...rest
}: WorkspaceMainProps): React.JSX.Element {
  const { isRootHeaderAware, hasLeftSidebar, hasRightSidebar } = useWorkspaceColumns();

  const shouldReserveLeft = Boolean(reserveLeftSpace && !hasLeftSidebar);
  const shouldReserveRight = Boolean(reserveRightSpace && !hasRightSidebar);

  // ARCHITECTURE NOTE:
  // Content scrolls BEHIND the transparent glass header. We use padding (not margin)
  // to offset the initial content position, but scrolling moves content up behind header.
  // The header has backdrop-blur which creates the glass effect over scrolling content.
  let topClass: string | null = null;
  if (!isRootHeaderAware) {
    if (isTouchMobile) {
      // Touch mobile: use padding to push content below header initially
      topClass = 'pt-[calc(var(--reader-header-height-compact)+var(--reader-safe-area-top))]';
    } else {
      // Desktop: use padding to push content below header initially
      // Content scrolls behind the transparent header naturally
      topClass = 'pt-[calc(var(--reader-header-height)+var(--reader-safe-area-top))]';
    }
  }

  // On touch mobile, we DON'T use overflow-y-auto so the body can scroll
  // This enables Chrome's address bar auto-hide on mobile
  // On desktop, we keep overflow-y-auto for container scrolling
  const overflowClass = isTouchMobile
    ? 'overflow-visible'
    : 'overflow-y-auto overflow-x-hidden min-h-0';

  return (
    <Component
      {...rest}
      data-slot={dataSlot ?? 'workspace-main'}
      className={cn(
        'relative flex flex-1 flex-col text-foreground',
        overflowClass,
        topClass,
        'pb-safe',
        shouldReserveLeft && 'xl:pl-reader-sidebar-left',
        shouldReserveRight && 'xl:pr-reader-sidebar-right',
        className
      )}
    >
      <div
        className={cn(
          'flex flex-1 flex-col gap-6 px-4 pb-16 pt-6 sm:px-6 sm:pt-8 xl:px-8',
          contentClassName
        )}
      >
        {children}
      </div>
    </Component>
  );
}
