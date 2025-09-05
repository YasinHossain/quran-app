'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import React from 'react';

import { useNavigation } from '@/app/providers/NavigationContext';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import { QuranBottomSheet } from './QuranBottomSheet';
import { SwipeContainer } from './SwipeContainer';
import { SwipeIndicator } from './SwipeIndicator';
import { AdaptiveNavigation } from '../components/AdaptiveNavigation';

interface ModernLayoutProps {
  children: React.ReactNode;
}

export const ModernLayout = ({ children }: ModernLayoutProps): React.JSX.Element => {
  const pathname = usePathname();
  const { isQuranBottomSheetOpen, setQuranBottomSheetOpen, navigateToSurah, showQuranSelector } =
    useNavigation();

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

  const handleSurahJump = () => {
    showQuranSelector();
  };

  const isHomePage = pathname === '/' || pathname === '/home';

  return (
    <>
      {/* Main content with bottom padding for navigation */}
      <SwipeContainer className={`min-h-[100dvh] ${!isHomePage ? 'bottom-nav-space lg:pb-0' : ''}`}>
        {children}
      </SwipeContainer>

      {/* Adaptive Navigation */}
      <AdaptiveNavigation onSurahJump={handleSurahJump} />

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
