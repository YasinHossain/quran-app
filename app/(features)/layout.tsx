'use client';

import { usePathname } from 'next/navigation';
import Header from '@/app/shared/Header';
import ModernLayout from '@/app/shared/navigation/ModernLayout';
import { HeaderVisibilityProvider } from '@/app/(features)/layout/context/HeaderVisibilityContext';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Check if we're on the home page
  const isHomePage = pathname === '/';

  return (
    <ModernLayout>
      {/* Only show main header if not on home page */}
      {!isHomePage && <Header />}

      {/* Main content area */}
      <div className="flex flex-col min-h-[100dvh]">
        <div className="flex-grow min-h-0 transition-all duration-300">{children}</div>
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
