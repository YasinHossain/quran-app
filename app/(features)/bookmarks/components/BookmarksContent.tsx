'use client';

import React, { useState } from 'react';
import { BookmarkIcon, PinIcon, ClockIcon, BrainIcon } from '@/app/shared/icons';
import { ChevronDownIcon } from '@/app/shared/ui/Icon';
import { cn } from '@/lib/utils/cn';
import { FolderVerseCard } from './FolderVerseCard';
import type { Folder } from '@/types/bookmark';

interface BookmarksContentProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  children?: React.ReactNode;
  folders?: Folder[];
  onVerseClick?: (verseKey: string) => void;
}

export const BookmarksContent: React.FC<BookmarksContentProps> = ({
  activeSection = 'bookmarks',
  onSectionChange,
  children,
  folders = [],
  onVerseClick,
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolderExpansion = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const sections = [
    { id: 'bookmarks', icon: BookmarkIcon, label: 'All Bookmarks', description: 'Manage folders' },
    { id: 'pinned', icon: PinIcon, label: 'Pinned Verses', description: 'Quick access' },
    { id: 'last-read', icon: ClockIcon, label: 'Recent', description: 'Last visited' },
    { id: 'memorization', icon: BrainIcon, label: 'Memorization Plan', description: 'Track progress' },
  ];

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-2 sm:p-3 touch-pan-y">
      {/* Main Navigation - Card-like design */}
      <nav className="mb-6">
        <div className="space-y-3">
          {sections.map((section) => (
            <div
              key={section.id}
              onClick={onSectionChange ? () => onSectionChange(section.id) : undefined}
              className={cn(
                'p-4 rounded-xl border transition-all duration-200 cursor-pointer group',
                activeSection === section.id
                  ? 'bg-accent border-accent shadow-lg shadow-accent/20'
                  : 'bg-surface border-border hover:border-accent/30 hover:bg-surface-hover hover:shadow-md'
              )}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200',
                    activeSection === section.id
                      ? 'bg-white/20 text-white'
                      : 'bg-accent/10 text-accent group-hover:bg-accent/15'
                  )}
                >
                  <section.icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      'font-semibold text-sm transition-colors duration-200',
                      activeSection === section.id
                        ? 'text-white'
                        : 'text-foreground group-hover:text-accent'
                    )}
                  >
                    {section.label}
                  </div>
                  <div
                    className={cn(
                      'text-xs transition-colors duration-200',
                      activeSection === section.id ? 'text-white/70' : 'text-muted'
                    )}
                  >
                    {section.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Folders Section */}
      {folders.length > 0 && (
        <div className="mb-6">
          <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 px-2">
            Your Folders
          </div>
          <div className="space-y-2">
            {folders.map((folder) => (
              <div key={folder.id} className="space-y-1">
                {/* Folder Header */}
                <div
                  onClick={() => toggleFolderExpansion(folder.id)}
                  className={cn(
                    'p-3 rounded-lg border transition-all duration-200 cursor-pointer group',
                    'bg-surface border-border hover:border-accent/30 hover:bg-surface-hover hover:shadow-sm'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-semibold"
                        style={{ backgroundColor: folder.color || '#7C3AED' }}
                      >
                        {folder.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-foreground truncate">
                          {folder.name}
                        </div>
                        <div className="text-xs text-muted">
                          {folder.bookmarks.length} verse{folder.bookmarks.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <ChevronDownIcon
                      className={cn(
                        'w-4 h-4 text-muted transition-transform duration-200',
                        expandedFolders.has(folder.id) && 'rotate-180'
                      )}
                    />
                  </div>
                </div>

                {/* Expanded Verse Cards */}
                {expandedFolders.has(folder.id) && (
                  <div className="ml-2 pl-3 border-l-2 border-border/50 space-y-2 animate-in slide-in-from-top-2 duration-200">
                    {folder.bookmarks.slice(0, 5).map((bookmark) => (
                      <FolderVerseCard
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
            ))}
          </div>
        </div>
      )}

      {children && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 px-2">
            More
          </div>
          <div className="space-y-1">{children}</div>
        </div>
      )}
    </div>
  );
};