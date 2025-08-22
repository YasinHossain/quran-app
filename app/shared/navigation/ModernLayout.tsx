'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import BottomNavigation from './BottomNavigation';
import FloatingQuranButton from './FloatingQuranButton';
import QuranBottomSheet from './QuranBottomSheet';
import SwipeContainer from './SwipeContainer';
import SwipeIndicator from './SwipeIndicator';
import { useNavigation } from '@/app/providers/NavigationContext';

interface ModernLayoutProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
  showFloatingButton?: boolean;
}

const ModernLayout: React.FC<ModernLayoutProps> = ({
  children,
  showBottomNav = true,
  showFloatingButton = true,
}) => {
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

  // Hide navigation on home page and floating button on verse pages
  const isHomePage = pathname === '/' || pathname === '/home';
  const isVersePage = pathname.includes('/surah/');
  const shouldShowBottomNav = showBottomNav && !isHomePage;
  const shouldShowFloatingButton = showFloatingButton && !isHomePage && !isVersePage;

  return (
    <>
      {/* Main content with bottom padding for navigation */}
      <SwipeContainer
        className={`min-h-[100dvh] ${shouldShowBottomNav ? 'bottom-nav-space lg:pb-0' : ''}`}
      >
        {children}
      </SwipeContainer>

      {/* Modern Navigation Elements */}
      {shouldShowBottomNav && <BottomNavigation onSurahJump={handleSurahJump} />}

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
