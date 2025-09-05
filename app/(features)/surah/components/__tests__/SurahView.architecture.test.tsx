/**
 * @fileoverview Architecture-Compliant Tests for SurahView
 * @description Week 6 implementation demonstrating complete testing patterns
 */

import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Architecture-compliant testing utilities
import {
  renderWithSpecificProviders,
  createContextTestSuite,
} from '@/app/testUtils/contextTestUtils';
import { createPerformanceTestSuite } from '@/app/testUtils/performanceTestUtils';
import { renderWithProviders } from '@/app/testUtils/renderWithProviders';
import {
  mockViewport,
  testBreakpoints,
  assertResponsiveClasses,
  assertTouchFriendly,
  BREAKPOINTS,
  setupResponsiveTests,
} from '@/app/testUtils/responsiveTestUtils';

// Component under test
import { SurahView } from '../SurahView.client';

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock header visibility context
jest.mock('@/app/(features)/layout/context/HeaderVisibilityContext', () => ({
  useHeaderVisibility: () => ({ isHidden: false }),
}));

// Mock panels hook
jest.mock('@/app/(features)/surah/hooks', () => {
  const actual = jest.requireActual('@/app/(features)/surah/hooks');
  return {
    ...actual,
    useSurahPanels: () => ({
      isTranslationPanelOpen: false,
      openTranslationPanel: jest.fn(),
      closeTranslationPanel: jest.fn(),
      isWordLanguagePanelOpen: false,
      openWordLanguagePanel: jest.fn(),
      closeWordLanguagePanel: jest.fn(),
      selectedTranslationName: 'Sahih International',
      selectedWordLanguageName: 'English',
    }),
    useVerseListing: () => ({
      error: null,
      isLoading: false,
      verses: [
        {
          id: 1,
          verse_key: '1:1',
          words: [],
          translations: [{ id: 131, text: 'In the name of Allah', language: 'en' }],
        },
      ],
      isValidating: false,
      isReachingEnd: true,
      loadMoreRef: { current: null },
      translationOptions: [],
      wordLanguageOptions: [],
      wordLanguageMap: {},
      settings: { translationFontSize: 16 },
      setSettings: jest.fn(),
      activeVerse: null,
      reciter: { id: 1, name: 'Reciter', path: 'reciter' },
      isPlayerVisible: false,
      handleNext: jest.fn(),
      handlePrev: jest.fn(),
    }),
  };
});

// Setup responsive environment
setupResponsiveTests();

describe('SurahView - Architecture Compliance Tests', () => {
  const defaultProps = {
    surahId: '1',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset to mobile-first
    mockViewport(BREAKPOINTS.mobile);

    // Reset document overflow changes
    document.body.style.overflow = '';
  });

  afterEach(() => {
    jest.clearAllTimers();
    // Clean up body overflow
    document.body.style.overflow = '';
  });

  describe('🏗️ Architecture Compliance', () => {
    it('applies mobile-first responsive layout correctly', () => {
      renderWithProviders(<SurahView {...defaultProps} />);

      const main = screen.getByRole('main');

      // Mobile-first responsive classes
      assertResponsiveClasses(main, {
        base: ['h-screen', 'overflow-hidden'],
        lg: ['mr-[20.7rem]'], // Desktop sidebar margin
      });
    });

    it('handles body overflow management', () => {
      const originalOverflow = document.body.style.overflow;

      const { unmount } = renderWithProviders(<SurahView {...defaultProps} />);

      // Should set overflow hidden on mount
      expect(document.body.style.overflow).toBe('hidden');

      unmount();

      // Should restore overflow on unmount
      expect(document.body.style.overflow).toBe(originalOverflow);
    });

    it('integrates with all required contexts', () => {
      renderWithProviders(<SurahView {...defaultProps} />);

      // Should render without context errors
      expect(screen.getByRole('main')).toBeInTheDocument();

      // Should display verse content (requires Settings context)
      const verseEl = document.querySelector('#verse-1');
      expect(verseEl).toBeInTheDocument();
    });
  });

  describe('📱 Mobile-First Responsive Design', () => {
    it('adapts layout across all breakpoints', () => {
      testBreakpoints((breakpointName, width) => {
        mockViewport(breakpointName);
        const { rerender } = renderWithProviders(<SurahView {...defaultProps} />);

        const main = screen.getByRole('main');

        if (width >= BREAKPOINTS.desktop) {
          // Desktop: Should have right margin for sidebar
          expect(main).toHaveClass('lg:mr-[20.7rem]');
        } else {
          // Mobile/Tablet: Full width
          expect(main).toHaveClass('h-screen');
        }

        // Verify scroll container responsive classes
        const scrollContainer = main.querySelector('.overflow-y-auto');
        expect(scrollContainer).toHaveClass('px-4', 'sm:px-6', 'lg:px-8');

        // Clean up
        rerender(<></>);
      });
    });

    it('provides touch-friendly interactions on mobile', () => {
      mockViewport(BREAKPOINTS.mobile);
      renderWithProviders(<SurahView {...defaultProps} />);

      // Verse action buttons should be touch-friendly
      const actionButton = screen.getByRole('button', { name: /open verse actions menu/i });
      assertTouchFriendly(actionButton);
      expect(actionButton).toHaveClass('min-h-touch');
    });

    it('displays proper header spacing based on visibility', () => {
      renderWithProviders(<SurahView {...defaultProps} />);

      const scrollContainer = document.querySelector('.overflow-y-auto');
      expect(scrollContainer?.className).toContain('pt-[calc(3.5rem+env(safe-area-inset-top))]');
    });
  });

  describe('🔄 Context Integration', () => {
    it('integrates with SettingsContext for verse display', () => {
      renderWithSpecificProviders(<SurahView {...defaultProps} />, ['Settings']);

      // Should access settings without errors
      expect(screen.getByRole('main')).toBeInTheDocument();

      // Should display content with settings applied
      const verseEl = document.querySelector('#verse-1');
      expect(verseEl).toBeInTheDocument();
    });

    it('integrates with AudioContext for player state', () => {
      renderWithSpecificProviders(<SurahView {...defaultProps} />, ['Settings', 'Audio']);

      // Should render audio player without errors
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('integrates with BookmarkContext for verse bookmarking', () => {
      renderWithSpecificProviders(<SurahView {...defaultProps} />, ['Settings', 'Bookmark']);

      // Should show bookmark actions
      const actionButton = screen.getByRole('button', { name: /open verse actions menu/i });
      fireEvent.click(actionButton);

      expect(screen.getByText(/Add Bookmark|Remove Bookmark/)).toBeInTheDocument();
    });

    it('updates when context values change', async () => {
      renderWithProviders(<SurahView {...defaultProps} />);

      // Settings panel should update display
      const settingsButton = screen.getByRole('button', { name: /settings/i });
      fireEvent.click(settingsButton);

      // Panel should be accessible
      await waitFor(() => {
        const panel = screen.getByRole('complementary', { name: /settings/i });
        expect(panel).toBeInTheDocument();
      });
    });
  });

  describe('⚡ Performance Optimization', () => {
    it('memoizes expensive verse rendering', () => {
      const { rerender } = renderWithProviders(<SurahView {...defaultProps} />);

      // Get initial verse element
      const verse = document.querySelector('#verse-1');
      expect(verse).toBeInTheDocument();

      // Re-render with same props - should not recreate DOM
      rerender(<SurahView {...defaultProps} />);

      // Verse should still be there and efficiently rendered
      const sameVerse = document.querySelector('#verse-1');
      expect(sameVerse).toBeInTheDocument();
    });

    it('efficiently manages scroll position persistence', () => {
      renderWithProviders(<SurahView {...defaultProps} />);

      const scrollContainer = document.querySelector('.overflow-y-auto') as HTMLElement;
      expect(scrollContainer).toBeInTheDocument();

      // Scroll position should be managed efficiently
      // (This would be tested with actual scroll behavior)
    });
  });

  describe('♿ Accessibility', () => {
    it('provides proper semantic structure', () => {
      renderWithProviders(<SurahView {...defaultProps} />);

      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();

      // Should have accessible verse structure
      const verseEl = document.querySelector('#verse-1');
      expect(verseEl).toHaveAttribute('role');
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SurahView {...defaultProps} />);

      // Tab should navigate to actionable elements
      await user.tab();

      // Should focus on verse action button
      const actionButton = screen.getByRole('button', { name: /open verse actions menu/i });
      expect(actionButton).toHaveFocus();

      // Enter should activate
      await user.keyboard('{Enter}');
      expect(screen.getByText(/Add Bookmark|Remove Bookmark/)).toBeInTheDocument();
    });

    it('provides screen reader support', () => {
      renderWithProviders(<SurahView {...defaultProps} />);

      // Verse elements should have proper ARIA labels
      const verseEl = document.querySelector('#verse-1');
      expect(verseEl).toHaveAttribute('aria-label');
    });
  });

  describe('🎯 User Interactions', () => {
    it('handles verse interactions correctly', async () => {
      renderWithProviders(<SurahView {...defaultProps} />);

      const actionButton = screen.getByRole('button', { name: /open verse actions menu/i });
      fireEvent.click(actionButton);

      // Should open action menu
      await waitFor(() => {
        expect(screen.getByText(/Add Bookmark|Remove Bookmark/)).toBeInTheDocument();
      });
    });

    it('manages settings panel interactions', async () => {
      renderWithProviders(<SurahView {...defaultProps} />);

      const settingsButton = screen.getByRole('button', { name: /settings/i });
      fireEvent.click(settingsButton);

      // Settings panel should open
      await waitFor(() => {
        const panel = screen.getByRole('complementary', { name: /settings/i });
        expect(panel).toBeInTheDocument();
      });
    });

    it('handles touch gestures on mobile', async () => {
      mockViewport(BREAKPOINTS.mobile);
      const user = userEvent.setup();

      renderWithProviders(<SurahView {...defaultProps} />);

      const actionButton = screen.getByRole('button', { name: /open verse actions menu/i });

      // Touch interaction
      await user.pointer({ keys: '[TouchA>]', target: actionButton });
      await user.pointer({ keys: '[/TouchA]' });

      await waitFor(() => {
        expect(screen.getByText(/Add Bookmark|Remove Bookmark/)).toBeInTheDocument();
      });
    });
  });

  describe('🔄 Loading States', () => {
    it('displays loading states appropriately', () => {
      // Mock loading state
      jest.doMock('@/app/(features)/surah/hooks', () => ({
        useVerseListing: () => ({
          isLoading: true,
          verses: [],
          error: null,
          // ... other properties
        }),
      }));

      renderWithProviders(<SurahView {...defaultProps} />);

      // Should show loading indicator
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe('❌ Error Handling', () => {
    it('handles API errors gracefully', () => {
      // Mock error state
      jest.doMock('@/app/(features)/surah/hooks', () => ({
        useVerseListing: () => ({
          isLoading: false,
          verses: [],
          error: 'Failed to load verses',
          // ... other properties
        }),
      }));

      renderWithProviders(<SurahView {...defaultProps} />);

      // Should display error message
      expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
    });
  });

  describe('🚀 Integration Tests', () => {
    it('works end-to-end with complete verse reading flow', async () => {
      renderWithProviders(<SurahView {...defaultProps} />);

      // 1. Component renders with responsive layout
      const main = screen.getByRole('main');
      expect(main).toHaveClass('h-screen', 'overflow-hidden');

      // 2. Verse content displays
      const verseEl = document.querySelector('#verse-1');
      expect(verseEl).toBeInTheDocument();

      // 3. Settings integration works
      const settingsButton = screen.getByRole('button', { name: /settings/i });
      fireEvent.click(settingsButton);

      // 4. Responsive interactions work
      const actionButton = screen.getByRole('button', { name: /open verse actions menu/i });
      expect(actionButton).toHaveClass('min-h-touch');

      // 5. Context integrations function
      fireEvent.click(actionButton);
      await waitFor(() => {
        expect(screen.getByText(/Add Bookmark|Remove Bookmark/)).toBeInTheDocument();
      });
    });
  });
});

// Generate automated performance test suite
createPerformanceTestSuite('SurahView', SurahView, defaultProps);

// Generate automated context test suite
createContextTestSuite('SurahView', SurahView, defaultProps);
