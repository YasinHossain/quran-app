'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

import { useNavigation } from '@/app/providers/NavigationContext';

import { QuranBottomSheet } from './QuranBottomSheet';
import { SwipeContainer } from './SwipeContainer';
import { SwipeIndicator } from './SwipeIndicator';
import { AdaptiveNavigation } from '../components/AdaptiveNavigation';

import type React from 'react';

interface ModernLayoutProps {
  children: React.ReactNode;
}

export const ModernLayout = ({ children }: ModernLayoutProps): JSX.Element => {
  const pathname = usePathname();
  const { isQuranBottomSheetOpen, setQuranBottomSheetOpen, navigateToSurah, showQuranSelector } =
    useNavigation();

  // Show swipe indicator on first visit
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(false);

  useEffect(() => {
    const hasSeenSwipeGestures = localStorage.getItem('hasSeenSwipeGestures');
    if (!hasSeenSwipeGestures) {
      setShowSwipeIndicator(true);
      localStorage.setItem('hasSeenSwipeGestures', 'true');
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
