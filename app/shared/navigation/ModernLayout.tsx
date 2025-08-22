'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import FloatingQuranButton from './FloatingQuranButton';
import QuranBottomSheet from './QuranBottomSheet';
import SwipeContainer from './SwipeContainer';
import SwipeIndicator from './SwipeIndicator';
import AdaptiveNavigation from '../components/AdaptiveNavigation';
import { useNavigation } from '@/app/providers/NavigationContext';

interface ModernLayoutProps {
  children: React.ReactNode;
  showFloatingButton?: boolean;
}

const ModernLayout: React.FC<ModernLayoutProps> = ({ children, showFloatingButton = true }) => {
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

  // Hide floating button on verse and tafsir pages
  const isHomePage = pathname === '/' || pathname === '/home';
  const isVersePage = pathname.includes('/surah/');
  const isTafsirPage = pathname.includes('/tafsir/');
  const shouldShowFloatingButton =
    showFloatingButton && !isHomePage && !isVersePage && !isTafsirPage;

  return (
    <>
      {/* Main content with bottom padding for navigation */}
      <SwipeContainer className={`min-h-[100dvh] ${!isHomePage ? 'bottom-nav-space lg:pb-0' : ''}`}>
        {children}
      </SwipeContainer>

      {/* Adaptive Navigation */}
      <AdaptiveNavigation onSurahJump={handleSurahJump} />

      {shouldShowFloatingButton && <FloatingQuranButton onPress={showQuranSelector} />}

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

export default ModernLayout;
