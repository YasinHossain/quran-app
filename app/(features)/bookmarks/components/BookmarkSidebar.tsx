'use client';

import React from 'react';
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
  const sections = [
    { key: 'bookmarks', label: 'Bookmarks', icon: BookmarkIcon, colorScheme: 'folder', count: 5 },
    { key: 'pin-ayah', label: 'Pinned Verses', icon: PinIcon, colorScheme: 'pinned', count: 2 },
    {
      key: 'last-read',
      label: 'Reading History',
      icon: ClockIcon,
      colorScheme: 'lastRead',
      count: 3,
    },
  ] as const;

  return (
    <aside className="bookmark-sidebar md:w-80 w-full text-gray-900 dark:text-white flex flex-col shadow-lg">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
          Bookmarks
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          Organize & access your verses
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-3">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.key;

          return (
            <button
              key={section.key}
              onClick={() => onSectionChange(section.key)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-teal-100 dark:bg-teal-900/30 border-2 border-teal-200 dark:border-teal-700 shadow-md'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  isActive ? 'bg-white dark:bg-teal-800 shadow-sm' : 'bg-gray-100 dark:bg-gray-600'
                }`}
              >
                <Icon
                  size={20}
                  className={
                    isActive
                      ? 'text-teal-600 dark:text-teal-400'
                      : 'text-gray-500 dark:text-gray-300'
                  }
                />
              </div>

              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span
                    className={`font-medium ${
                      isActive
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {section.label}
                  </span>
                  {section.count !== undefined && section.count > 0 && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        isActive
                          ? 'text-teal-800 dark:text-teal-200 bg-white dark:bg-teal-800'
                          : 'text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600'
                      }`}
                    >
                      {section.count}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default BookmarkSidebar;
