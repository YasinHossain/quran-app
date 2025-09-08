'use client';

import type { ReactNode } from 'react';

interface BookmarksMainContentProps {
  children: ReactNode;
  isHeaderHidden: boolean;
}

export const BookmarksMainContent = ({
  children,
  isHeaderHidden,
}: BookmarksMainContentProps): React.JSX.Element => (
  <main className="flex-1 h-full overflow-hidden">
    <div
      className={`h-full overflow-y-auto p-4 sm:p-6 md:p-8 pb-6 transition-all duration-300 ${
        isHeaderHidden
          ? 'pt-2 sm:pt-3 md:pt-4'
          : 'pt-[calc(3.5rem+0.5rem+env(safe-area-inset-top))] sm:pt-[calc(4rem+0.75rem+env(safe-area-inset-top))] md:pt-[calc(4rem+1rem+env(safe-area-inset-top))]'
      }`}
    >
      {children}
    </div>
  </main>
);
