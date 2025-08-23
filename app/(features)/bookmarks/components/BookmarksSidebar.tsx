'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BookmarkIcon, PinIcon, ClockIcon, FolderIcon } from '@/app/shared/icons';
import { ListItem } from '@/app/shared/ui/ListItem';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { cn } from '@/lib/utils/cn';

interface BookmarksSidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  children?: React.ReactNode;
}

export const BookmarksSidebar: React.FC<BookmarksSidebarProps> = ({
  activeSection = 'bookmarks',
  onSectionChange,
  children,
}) => {
  const sections = [
    { id: 'bookmarks', icon: BookmarkIcon, label: 'Bookmark' },
    { id: 'pinned', icon: PinIcon, label: 'Pins' },
    { id: 'last-read', icon: ClockIcon, label: 'Last Reads' },
  ];
  const { folders } = useBookmarks();
  const router = useRouter();

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">Quran Mazid</h1>
        <p className="text-sm text-muted mt-1">Read, Study, and Learn The Quran</p>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
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

        {folders.length > 0 && (
          <div className="mt-4 space-y-2">
            {folders.map((folder) => {
              const IconComp = ({ className }: { className?: string }) =>
                folder.icon ? (
                  <span className={cn('text-xl', folder.color, className)}>{folder.icon}</span>
                ) : (
                  <FolderIcon className={cn(className, folder.color)} />
                );
              return (
                <ListItem
                  key={folder.id}
                  icon={IconComp}
                  label={folder.name}
                  onClick={() => router.push(`/bookmarks/${folder.id}`)}
                  className="px-3 py-3 rounded-lg transition-colors hover:bg-surface-hover"
                />
              );
            })}
          </div>
        )}

        {children && <div className="mt-4 pt-4 border-t border-border space-y-3">{children}</div>}
      </div>
    </div>
  );
};
