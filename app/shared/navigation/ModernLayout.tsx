'use client';

import dynamic from 'next/dynamic';
import React from 'react';

import { useNavigation } from '@/app/providers/NavigationContext';

const QuranBottomSheet = dynamic(
  () => import('./QuranBottomSheet').then((m) => m.QuranBottomSheet),
  { ssr: false }
);

interface ModernLayoutProps {
  children: React.ReactNode;
  isNavHidden?: boolean;
}

export const ModernLayout = ({
  children,
  isNavHidden = false,
}: ModernLayoutProps): React.JSX.Element => {
  const { isQuranBottomSheetOpen, setQuranBottomSheetOpen, navigateToSurah } = useNavigation();

  // Use selector directly when needed; remove unused helpers to satisfy lint

  return (
    <>
      {/* Main content with bottom padding for navigation */}
      <div className="min-h-[100dvh] transition-all duration-300 xl:pb-0">{children}</div>

      {/* Navigation handled by unified Navigation component (left rail on desktop, bottom on mobile) */}

      {/* Floating Quran Button removed per request */}

      {/* Bottom Sheet for Quran Selection */}
      <QuranBottomSheet
        isOpen={isQuranBottomSheetOpen}
        onClose={() => setQuranBottomSheetOpen(false)}
        onSurahSelect={navigateToSurah}
      />
    </>
  );
};
