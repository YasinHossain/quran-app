'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { SidebarHeader } from '@/app/shared/components/SidebarHeader';
import { cn } from '@/lib/utils/cn';

import { NavigationSection } from './NavigationSection';

import type { SectionId } from '@/app/shared/ui/cards/BookmarkNavigationCard';

interface BookmarksContentProps {
  activeSection?: SectionId;
  onSectionChange?: ((section: SectionId) => void) | undefined;
  children?: React.ReactNode;
  childrenTitle?: string | null;
  childrenContainerClassName?: string;
  childrenContentClassName?: string;
  showNavigation?: boolean;
  onClose?: () => void;
}

export const BookmarksContent = ({
  activeSection = 'bookmarks',
  onSectionChange,
  children,
  childrenTitle,
  childrenContainerClassName,
  childrenContentClassName,
  showNavigation = true,
  onClose,
}: BookmarksContentProps): React.JSX.Element => {
  const { t } = useTranslation();
  return (
    <div className="relative flex flex-1 min-h-0 flex-col bg-background text-foreground">
      <SidebarHeader
        title={t('bookmarks')}
        titleClassName="text-mobile-lg font-semibold text-content-primary"
        className="xl:hidden"
        showCloseButton
        {...(onClose ? { onClose } : {})}
        forceVisible
      />

      <div className="flex-1 overflow-hidden flex flex-col">
        {showNavigation ? (
          <div>
            <NavigationSection activeSection={activeSection} onSectionChange={onSectionChange} />
          </div>
        ) : null}

        <div
          className="flex-1 min-h-0 overflow-y-auto touch-pan-y"
          // Reserve scroll gutter so edge-to-edge dividers reach the sidebar edge.
          style={{ scrollbarGutter: 'stable' }}
        >
          <ChildrenSection
            {...(childrenTitle !== undefined ? { title: childrenTitle } : {})}
            {...(childrenContainerClassName !== undefined
              ? { containerClassName: childrenContainerClassName }
              : {})}
            {...(childrenContentClassName !== undefined
              ? { contentClassName: childrenContentClassName }
              : {})}
          >
            {children}
          </ChildrenSection>
        </div>
      </div>
    </div>
  );
};

function ChildrenSection({
  children,
  title,
  containerClassName,
  contentClassName,
}: {
  children?: React.ReactNode;
  title?: string | null;
  containerClassName?: string;
  contentClassName?: string;
}): React.JSX.Element | null {
  if (!children) return null;

  const heading = title === undefined ? 'More' : title;

  return (
    <div className={cn('pt-1.5 px-2 sm:px-3', containerClassName)}>
      {heading !== null ? (
        <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-2">
          {heading}
        </div>
      ) : null}
      <div className={cn('space-y-1', contentClassName)}>{children}</div>
    </div>
  );
}
