'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/app/providers/SidebarContext';

/**
 * Sidebar navigation for bookmark-related routes.
 * Replaces the surah list sidebar on /bookmarks pages.
 */
const BookmarkSidebar = () => {
  const pathname = usePathname();
  const { isSurahListOpen } = useSidebar();

  const links = [
    { href: '/bookmarks', label: 'Bookmarks' },
    { href: '/bookmarks/pinned', label: 'Pin Ayah' },
    { href: '/bookmarks/last-read', label: 'Last Read' },
  ];

  return (
    <aside
      className={`fixed md:static top-16 md:top-0 bottom-0 left-0 w-[20.7rem] bg-white dark:bg-[var(--background)] text-[var(--foreground)] flex flex-col shadow-lg z-40 md:z-10 md:h-full transform transition-transform duration-300 ${
        isSurahListOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="p-4 border-b border-[var(--border-color)] font-bold">Bookmarks</div>
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`block px-3 py-2 rounded-md text-sm transition-colors hover:bg-gray-100 dark:hover:bg-slate-800 ${
                active ? 'bg-gray-100 dark:bg-slate-800 font-semibold' : ''
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default BookmarkSidebar;
