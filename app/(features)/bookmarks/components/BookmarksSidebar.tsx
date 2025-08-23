'use client';

import React from 'react';
import { PinIcon, ClockIcon } from '@/app/shared/icons';
import { ListItem } from '@/app/shared/ui/ListItem';

interface BookmarksSidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export const BookmarksSidebar: React.FC<BookmarksSidebarProps> = ({
  activeSection = 'bookmarks',
  onSectionChange,
}) => {
  const sections = [
    { id: 'bookmarks', icon: PinIcon, label: 'Bookmarks' },
    { id: 'pinned', icon: PinIcon, label: 'Pin Ayah' },
    { id: 'last-read', icon: ClockIcon, label: 'Last Read' },
  ];

  return (
    <div className="h-full flex flex-col p-4">
      <div className="space-y-4">
        <h1 className="px-3 text-xl font-bold text-foreground">Bookmarks</h1>
        <nav className="space-y-1">
          {sections.map((section) => (
            <ListItem
              key={section.id}
              icon={section.icon}
              label={section.label}
              isActive={activeSection === section.id}
              onClick={onSectionChange ? () => onSectionChange(section.id) : undefined}
            />
          ))}
        </nav>
      </div>
    </div>
  );
};
