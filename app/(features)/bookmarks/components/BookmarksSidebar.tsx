'use client';

import React from 'react';
import { BookmarkIcon, PinIcon, ClockIcon } from '@/app/shared/icons';
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
    { id: 'bookmarks', icon: BookmarkIcon, label: 'Bookmark' },
    { id: 'pinned', icon: PinIcon, label: 'Pins' },
    { id: 'last-read', icon: ClockIcon, label: 'Last Reads' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">Quran Mazid</h1>
        <p className="text-sm text-muted mt-1">Read, Study, and Learn The Quran</p>
      </div>

      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {sections.map((section) => (
            <ListItem
              key={section.id}
              icon={section.icon}
              label={section.label}
              isActive={activeSection === section.id}
              onClick={onSectionChange ? () => onSectionChange(section.id) : undefined}
              className="px-3 py-3 rounded-lg transition-colors hover:bg-surface-hover"
            />
          ))}
        </nav>
      </div>
    </div>
  );
};
