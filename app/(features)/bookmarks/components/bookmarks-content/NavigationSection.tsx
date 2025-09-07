'use client';

import React from 'react';

import { BookmarkIcon, PinIcon, ClockIcon, BrainIcon } from '@/app/shared/icons';
import { BookmarkNavigationCard } from '@/app/shared/ui/cards';

import type {
  BookmarkNavigationContent,
  SectionId,
} from '@/app/shared/ui/cards/BookmarkNavigationCard';

// Navigation sections configuration
const NAVIGATION_SECTIONS: BookmarkNavigationContent[] = [
  { id: 'bookmarks', icon: BookmarkIcon, label: 'All Bookmarks', description: 'Manage folders' },
  { id: 'pinned', icon: PinIcon, label: 'Pinned Verses', description: 'Quick access' },
  { id: 'last-read', icon: ClockIcon, label: 'Recent', description: 'Last visited' },
  {
    id: 'memorization',
    icon: BrainIcon,
    label: 'Memorization Plan',
    description: 'Track progress',
  },
];

interface NavigationSectionProps {
  activeSection: SectionId;
  onSectionChange?: (section: SectionId) => void;
}

export const NavigationSection = ({
  activeSection,
  onSectionChange,
}: NavigationSectionProps): React.JSX.Element => (
  <nav className="mb-6">
    <div className="space-y-2">
      {NAVIGATION_SECTIONS.map((section) => (
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

const NavigationItem = ({
  section,
  activeSection,
  onSectionChange,
}: {
  section: BookmarkNavigationContent;
  activeSection: SectionId;
  onSectionChange?: (section: SectionId) => void;
}): React.JSX.Element => (
  <BookmarkNavigationCard
    content={section}
    isActive={activeSection === section.id}
    {...(onSectionChange && { onSectionChange })}
  />
);
