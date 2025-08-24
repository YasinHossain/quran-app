'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BookmarkIcon, PinIcon, ClockIcon } from '@/app/shared/icons';
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
    { id: 'bookmarks', icon: BookmarkIcon, label: 'All Bookmarks', description: 'Manage folders' },
    { id: 'pinned', icon: PinIcon, label: 'Pinned Verses', description: 'Quick access' },
    { id: 'last-read', icon: ClockIcon, label: 'Recent', description: 'Last visited' },
  ];
  const router = useRouter();

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
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

        {children && (
          <div className="mt-6 pt-4 border-t border-border">
            <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 px-2">
              More
            </div>
            <div className="space-y-1">{children}</div>
          </div>
        )}
      </div>
    </div>
  );
};
