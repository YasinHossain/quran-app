'use client';

import React, { useState } from 'react';

import { BookmarkIcon, PinIcon, ClockIcon, BrainIcon } from '@/app/shared/icons';
import {
  BookmarkNavigationCard,
  BookmarkFolderCard,
  BookmarkVerseCard,
} from '@/app/shared/ui/cards';

import type {
  BookmarkNavigationContent,
  SectionId,
} from '@/app/shared/ui/cards/BookmarkNavigationCard';
import type { Folder } from '@/types/bookmark';

interface BookmarksContentProps {
  activeSection?: SectionId;
  onSectionChange?: (section: SectionId) => void;
  children?: React.ReactNode;
  folders?: Folder[];
  onVerseClick?: (verseKey: string) => void;
}

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

const NavigationSection = ({
  activeSection,
  onSectionChange,
}: NavigationSectionProps): React.JSX.Element => (
  <nav className="mb-6">
    <div className="space-y-2">
      {NAVIGATION_SECTIONS.map((section) => (
        <BookmarkNavigationCard
          key={section.id}
          content={section}
          isActive={activeSection === section.id}
          {...(onSectionChange && { onSectionChange })}
        />
      ))}
    </div>
  </nav>
);

interface FolderSectionProps {
  folders: Folder[];
  expandedFolders: Set<string>;
  toggleFolderExpansion: (folderId: string) => void;
  onVerseClick?: (verseKey: string) => void;
}

const FolderSection = ({
  folders,
  expandedFolders,
  toggleFolderExpansion,
  onVerseClick,
}: FolderSectionProps): React.JSX.Element | null => {
  if (folders.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 px-2">
        Your Folders
      </div>
      <div className="space-y-2">
        {folders.map((folder) => (
          <FolderItem
            key={folder.id}
            folder={folder}
            isExpanded={expandedFolders.has(folder.id)}
            onToggleExpansion={toggleFolderExpansion}
            onVerseClick={onVerseClick}
          />
        ))}
      </div>
    </div>
  );
};

interface FolderItemProps {
  folder: Folder;
  isExpanded: boolean;
  onToggleExpansion: (folderId: string) => void;
  onVerseClick?: (verseKey: string) => void;
}

const FolderItem = ({
  folder,
  isExpanded,
  onToggleExpansion,
  onVerseClick,
}: FolderItemProps): React.JSX.Element => (
  <div className="space-y-1">
    <BookmarkFolderCard
      folder={folder}
      isExpanded={isExpanded}
      onToggleExpansion={onToggleExpansion}
    />
    {isExpanded && (
      <div className="ml-2 pl-3 border-l-2 border-border/50 space-y-2 animate-in slide-in-from-top-2 duration-200">
        {folder.bookmarks.slice(0, 5).map((bookmark) => (
          <BookmarkVerseCard
            key={bookmark.verseId}
            bookmark={bookmark}
            onClick={() => onVerseClick?.(bookmark.verseKey || bookmark.verseId)}
            className="scale-95"
          />
        ))}
        {folder.bookmarks.length > 5 && (
          <div className="text-xs text-muted text-center py-2">
            +{folder.bookmarks.length - 5} more verses
          </div>
        )}
      </div>
    )}
  </div>
);

interface ChildrenSectionProps {
  children?: React.ReactNode;
}

const ChildrenSection = ({ children }: ChildrenSectionProps): React.JSX.Element | null => {
  if (!children) return null;

  return (
    <div className="mt-6 pt-4 border-t border-border">
      <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 px-2">
        More
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
};

export const BookmarksContent = ({
  activeSection = 'bookmarks',
  onSectionChange,
  children,
  folders = [],
  onVerseClick,
}: BookmarksContentProps): React.JSX.Element => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolderExpansion = (folderId: string): void => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-2 sm:p-3 touch-pan-y">
      <NavigationSection activeSection={activeSection} onSectionChange={onSectionChange} />
      <FolderSection
        folders={folders}
        expandedFolders={expandedFolders}
        toggleFolderExpansion={toggleFolderExpansion}
        onVerseClick={onVerseClick}
      />
      <ChildrenSection children={children} />
    </div>
  );
};
