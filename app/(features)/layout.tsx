'use client';

import { usePathname } from 'next/navigation';
import Header from '@/app/shared/Header';
import IconSidebar from '@/app/shared/IconSidebar';
import SurahListSidebar from '@/app/shared/SurahListSidebar';
import ModernLayout from '@/app/shared/navigation/ModernLayout';
import {
  HeaderVisibilityProvider,
  useHeaderVisibility,
} from '@/app/(features)/layout/context/HeaderVisibilityContext';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isHidden } = useHeaderVisibility();
  const pathname = usePathname();
  // This check determines if the current page is the new bookmarks page.
  // Using startsWith is slightly more robust for routing than includes.
  const isBookmarkPage = pathname.startsWith('/bookmarks');

  return (
    <ModernLayout>
      <Header />
      <div className="flex flex-col h-screen">
        <div
          className={`flex flex-grow overflow-hidden min-h-0 transition-[padding-top] duration-300 ${isHidden ? 'pt-0' : 'pt-16'}`}
        >
          {/* Desktop sidebars - hidden on mobile */}
          <nav aria-label="Primary navigation" className="hidden lg:flex flex-shrink-0 h-full">
            <IconSidebar />
          </nav>

          {/*
            The SurahListSidebar is now conditionally rendered for desktop only.
            On mobile, users will use the bottom navigation and floating button.
          */}
          {!isBookmarkPage && (
            <nav aria-label="Surah navigation" className="hidden lg:flex flex-shrink-0 h-full">
              <SurahListSidebar />
            </nav>
          )}
          {children}
        </div>
      </div>
    </ModernLayout>
  );
}

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return (
    <HeaderVisibilityProvider>
      <LayoutContent>{children}</LayoutContent>
    </HeaderVisibilityProvider>
  );
}
