'use client';

import { usePathname } from 'next/navigation';
import Header from '@/app/shared/Header';
import SurahListSidebar from '@/app/shared/SurahListSidebar';
import AdaptiveLayout from '@/app/shared/components/AdaptiveLayout';
import { HeaderVisibilityProvider } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { useSidebar } from '@/app/providers/SidebarContext';
import { useResponsiveState } from '@/lib/responsive';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isSurahListOpen, setSurahListOpen } = useSidebar();
  const { variant } = useResponsiveState();
  const pathname = usePathname();
  // Determine if the current page is the bookmarks page.
  const isBookmarkPage = pathname.startsWith('/bookmarks');
  // Check if we're on the home page
  const isHomePage = pathname === '/';

  const sidebarOpen = variant === 'expanded' ? !isBookmarkPage : isSurahListOpen;

  return (
    <AdaptiveLayout
      sidebarContent={!isBookmarkPage ? <SurahListSidebar /> : undefined}
      sidebarOpen={sidebarOpen}
      onSidebarToggle={() => setSurahListOpen(!isSurahListOpen)}
    >
      {!isHomePage && <Header />}
      <div className="flex flex-col min-h-[100dvh]">
        <div className="flex-grow min-h-0">{children}</div>
      </div>
    </AdaptiveLayout>
  );
}

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return (
    <HeaderVisibilityProvider>
      <LayoutContent>{children}</LayoutContent>
    </HeaderVisibilityProvider>
  );
}
