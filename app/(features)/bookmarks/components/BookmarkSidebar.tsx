'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/app/providers/SidebarContext';
import { useTheme } from '@/app/providers/ThemeContext';
import { BookmarkIcon, PinIcon, ClockIcon } from 'lucide-react';

interface BookmarkSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

/**
 * Collapsible sidebar navigation for bookmark-related sections.
 * Replaces the surah list sidebar on /bookmarks pages.
 */
const BookmarkSidebar = ({ activeSection, onSectionChange }: BookmarkSidebarProps) => {
  const { isSurahListOpen } = useSidebar();
  const { theme } = useTheme();

  const sections = [
    { key: 'bookmarks', label: 'Bookmarks', icon: BookmarkIcon },
    { key: 'pin-ayah', label: 'Pin Ayah', icon: PinIcon },
    { key: 'last-read', label: 'Last Read', icon: ClockIcon },
  ];

  return (
    <aside
      className={`fixed md:static top-16 md:top-0 bottom-0 left-0 w-[20.7rem] bg-white dark:bg-[var(--background)] text-[var(--foreground)] flex flex-col shadow-lg z-40 md:z-10 md:h-full transform transition-transform duration-300 ${
        isSurahListOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="p-4 border-b border-[var(--border-color)]">
        <h2 className="text-lg font-bold">Bookmarks</h2>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-2 space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.key;
          
          return (
            <button
              key={section.key}
              onClick={() => onSectionChange(section.key)}
              className={`w-full flex items-center space-x-3 p-4 rounded-xl transition transform hover:scale-[1.02] ${
                isActive
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                  : theme === 'light'
                    ? 'bg-white shadow hover:bg-slate-50 text-slate-700'
                    : 'bg-slate-800 shadow hover:bg-slate-700 text-[var(--foreground)]'
              }`}
            >
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                  isActive
                    ? theme === 'light'
                      ? 'bg-gray-100 text-teal-600'
                      : 'bg-slate-700 text-teal-400'
                    : theme === 'light'
                      ? 'bg-gray-100 text-teal-600'
                      : 'bg-slate-700 text-teal-400'
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="font-medium">{section.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default BookmarkSidebar;
