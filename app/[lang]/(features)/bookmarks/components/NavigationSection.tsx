'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { BookmarkIcon, PinIcon, ClockIcon, CalendarIcon } from '@/app/shared/icons';
import { BookmarkNavigationCard } from '@/app/shared/ui/cards';

import type {
  BookmarkNavigationContent,
  SectionId,
} from '@/app/shared/ui/cards/BookmarkNavigationCard';

function NavigationItem({
  section,
  activeSection,
  onSectionChange,
}: {
  section: BookmarkNavigationContent;
  activeSection: SectionId;
  onSectionChange?: ((section: SectionId) => void) | undefined;
}): React.JSX.Element {
  return (
    <BookmarkNavigationCard
      content={section}
      isActive={activeSection === section.id}
      {...(onSectionChange && { onSectionChange })}
    />
  );
}

export function NavigationSection({
  activeSection,
  onSectionChange,
}: {
  activeSection: SectionId;
  onSectionChange?: ((section: SectionId) => void) | undefined;
}): React.JSX.Element {
  const { t } = useTranslation();

  const navigationSections: BookmarkNavigationContent[] = [
    {
      id: 'last-read',
      icon: ClockIcon,
      label: t('binder_tab_recent'),
      description: t('binder_tab_recent_desc'),
    },
    {
      id: 'bookmarks',
      icon: BookmarkIcon,
      label: t('binder_tab_all'),
      description: t('binder_tab_all_desc'),
    },
    {
      id: 'pinned',
      icon: PinIcon,
      label: t('binder_tab_pinned'),
      description: t('binder_tab_pinned_desc'),
    },
    {
      id: 'planner',
      icon: CalendarIcon,
      label: t('binder_tab_planner'),
      description: t('binder_tab_planner_desc'),
    },
  ];

  return (
    <nav className="px-2 sm:px-3 pt-2 sm:pt-2.5 pb-1.5">
      <div className="space-y-1.5">
        {navigationSections.map((section) => (
          <NavigationItem
            key={section.id}
            section={section}
            activeSection={activeSection}
            onSectionChange={onSectionChange}
          />
        ))}
      </div>
    </nav>
  );
}
