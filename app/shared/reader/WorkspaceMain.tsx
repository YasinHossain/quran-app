'use client';

import React from 'react';

import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
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
  const { isHidden } = useHeaderVisibility();
  const { isRootHeaderAware, hasLeftSidebar, hasRightSidebar } = useWorkspaceColumns();

  const shouldReserveLeft = Boolean(reserveLeftSpace && !hasLeftSidebar);
  const shouldReserveRight = Boolean(reserveRightSpace && !hasRightSidebar);

  // ARCHITECTURE NOTE:
  // When isRootHeaderAware is false, we apply STATIC top padding here.
  // This ensures the content starts below the header but can scroll UP behind the transparent header.
  // DO NOT make this padding dynamic based on isHidden, or the content will jump and the
  // "white block" background issue will return.
  const topPaddingClass = isRootHeaderAware
    ? null
    : 'pt-[calc(var(--reader-header-height)+var(--reader-safe-area-top))]';

  return (
    <Component
      {...rest}
      data-slot={dataSlot ?? 'workspace-main'}
      className={cn(
        'relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden bg-background text-foreground min-h-0',
        topPaddingClass,
        'pb-safe',
        shouldReserveLeft && 'xl:pl-reader-sidebar-left',
        shouldReserveRight && 'xl:pr-reader-sidebar-right',
        className
      )}
    >
      <div
        className={cn(
          'flex flex-1 flex-col gap-6 px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-8',
          contentClassName
        )}
      >
        {children}
      </div>
    </Component>
  );
}
