'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import dynamic from 'next/dynamic';

import { useNavigation } from '@/app/providers/NavigationContext';
import { logger } from '@/src/infrastructure/monitoring/Logger';

const QuranBottomSheet = dynamic(
  () => import('./QuranBottomSheet').then((m) => m.QuranBottomSheet),
  { ssr: false }
);
import { SwipeContainer } from './SwipeContainer';
const SwipeIndicator = dynamic(
  () => import('./SwipeIndicator').then((m) => m.SwipeIndicator),
  { ssr: false }
);

interface ModernLayoutProps {
  children: React.ReactNode;
}

export const ModernLayout = ({ children }: ModernLayoutProps): React.JSX.Element => {
  const { isQuranBottomSheetOpen, setQuranBottomSheetOpen, navigateToSurah } = useNavigation();

  // Show swipe indicator on first visit
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(false);

  useEffect(() => {
    try {
      const hasSeenSwipeGestures = localStorage.getItem('hasSeenSwipeGestures');
      if (!hasSeenSwipeGestures) {
        setShowSwipeIndicator(true);
        localStorage.setItem('hasSeenSwipeGestures', 'true');
      }
    } catch (error) {
      logger.warn('Swipe indicator storage unavailable', undefined, error as Error);
      setShowSwipeIndicator(false);
    }
  }, []);

  // Use selector directly when needed; remove unused helpers to satisfy lint

  return (
    <>
      {/* Main content with bottom padding for navigation */}
      <SwipeContainer className={`min-h-[100dvh] bottom-nav-space lg:pb-0`}>
        {children}
      </SwipeContainer>

      {/* Navigation handled by unified Navigation component (left rail on desktop, bottom on mobile) */}

      {/* Floating Quran Button removed per request */}

      {/* Bottom Sheet for Quran Selection */}
      <QuranBottomSheet
        isOpen={isQuranBottomSheetOpen}
        onClose={() => setQuranBottomSheetOpen(false)}
        onSurahSelect={navigateToSurah}
      />

      {/* Swipe Gesture Indicator */}
      <SwipeIndicator show={showSwipeIndicator} />
    </>
  );
};
