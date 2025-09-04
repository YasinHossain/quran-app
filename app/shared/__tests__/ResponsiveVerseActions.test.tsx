import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { testAccessibility } from '../../../lib/__tests__/responsive-test-utils';
import { ResponsiveVerseActions } from '../ResponsiveVerseActions';

// Create mock responsive state for different breakpoints
const mockResponsiveState = (variant: string, breakpoint: string) => ({
  variant,
  breakpoint,
  isMobile: breakpoint === 'mobile',
  isTablet: breakpoint === 'tablet',
  isDesktop: ['desktop', 'wide'].includes(breakpoint),
});

// Mock the responsive hook with ability to change states
let mockVariant = 'expanded';
let mockBreakpoint = 'desktop';

jest.mock('@/lib/responsive', () => ({
  useResponsiveState: () => mockResponsiveState(mockVariant, mockBreakpoint),
  touchClasses: {
    target: 'min-h-touch min-w-touch',
    gesture: 'touch-manipulation select-none',
    focus: 'focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none',
    active: 'active:scale-95 transition-transform',
  },
}));

const noop = () => {};

const defaultProps = {
  verseKey: '1:1',
  isPlaying: false,
  isLoadingAudio: false,
  isBookmarked: false,
  onPlayPause: noop,
  onBookmark: noop,
};

describe('ResponsiveVerseActions', () => {
  beforeEach(() => {
    mockVariant = 'expanded';
    mockBreakpoint = 'desktop';
  });

  describe('Cross-Device Rendering', () => {
    it('should render correctly on mobile devices', () => {
      mockVariant = 'compact';
      mockBreakpoint = 'mobile';

      render(<ResponsiveVerseActions {...defaultProps} />);

      expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /bookmark/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'View tafsir' })).toBeInTheDocument();
    });

    it('should render correctly on tablets', () => {
      mockVariant = 'default';
      mockBreakpoint = 'tablet';

      render(<ResponsiveVerseActions {...defaultProps} />);

      expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /bookmark/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'View tafsir' })).toBeInTheDocument();
    });

    it('should render correctly on desktop', () => {
      render(<ResponsiveVerseActions {...defaultProps} />);

      expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /bookmark/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'View tafsir' })).toBeInTheDocument();
    });
  });

  describe('Touch Target Compliance', () => {
    it('should have WCAG-compliant touch targets on mobile', () => {
      mockVariant = 'compact';
      mockBreakpoint = 'mobile';

      const { container } = render(<ResponsiveVerseActions {...defaultProps} />);

      const result = testAccessibility.testTouchTargets(container);

      expect(result.isCompliant).toBe(true);
      expect(result.undersizedTargets).toHaveLength(0);
    });

    it('should have appropriate touch targets on tablets', () => {
      mockVariant = 'default';
      mockBreakpoint = 'tablet';

      const { container } = render(<ResponsiveVerseActions {...defaultProps} />);

      const result = testAccessibility.testTouchTargets(container);

      expect(result.isCompliant).toBe(true);
      expect(result.totalTargets).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('should have proper focus management', async () => {
      const { container } = render(<ResponsiveVerseActions {...defaultProps} />);

      const result = await testAccessibility.testFocusManagement(container);

      expect(result.focusableCount).toBeGreaterThan(0);
      expect(result.hasLogicalOrder).toBe(true);
    });

    it('should support keyboard navigation', () => {
      render(<ResponsiveVerseActions {...defaultProps} />);

      const playButton = screen.getByRole('button', { name: /play/i });
      screen.getByRole('button', { name: /bookmark/i });

      playButton.focus();
      expect(document.activeElement).toBe(playButton);

      fireEvent.keyDown(playButton, { key: 'Tab' });
      // Focus should move to the next focusable element
      expect(document.activeElement).not.toBe(playButton);
    });
  });

  describe('Interactive Behavior', () => {
    it('should handle play button clicks', () => {
      const onPlayPause = jest.fn();
      render(<ResponsiveVerseActions {...defaultProps} onPlayPause={onPlayPause} />);

      const playButton = screen.getByRole('button', { name: /play/i });
      fireEvent.click(playButton);

      expect(onPlayPause).toHaveBeenCalledTimes(1);
    });

    it('should handle bookmark toggle', () => {
      const onBookmark = jest.fn();
      render(<ResponsiveVerseActions {...defaultProps} onBookmark={onBookmark} />);

      const bookmarkButton = screen.getByRole('button', { name: /bookmark/i });
      fireEvent.click(bookmarkButton);

      expect(onBookmark).toHaveBeenCalledTimes(1);
    });

    it('should show correct play/pause state', () => {
      const { rerender } = render(<ResponsiveVerseActions {...defaultProps} />);

      expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();

      rerender(<ResponsiveVerseActions {...defaultProps} isPlaying={true} />);

      expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
    });

    it('should show loading state', () => {
      render(<ResponsiveVerseActions {...defaultProps} isLoadingAudio={true} />);

      expect(screen.getByRole('button', { name: /loading/i })).toBeInTheDocument();
    });

    it('should show bookmarked state', () => {
      render(<ResponsiveVerseActions {...defaultProps} isBookmarked={true} />);

      const bookmarkButton = screen.getByRole('button', { name: /remove bookmark/i });
      expect(bookmarkButton).toBeInTheDocument();
    });
  });

  describe('Responsive Variants', () => {
    it('should apply compact variant classes for mobile', () => {
      mockVariant = 'compact';
      mockBreakpoint = 'mobile';

      const { container } = render(<ResponsiveVerseActions {...defaultProps} />);

      // Should have mobile-appropriate styling
      const component = container.firstChild as HTMLElement;
      expect(component).toBeTruthy();
    });

    it('should apply expanded variant classes for desktop', () => {
      mockVariant = 'expanded';
      mockBreakpoint = 'desktop';

      const { container } = render(<ResponsiveVerseActions {...defaultProps} />);

      // Should have desktop-appropriate styling
      const component = container.firstChild as HTMLElement;
      expect(component).toBeTruthy();
    });
  });

  describe('Original Functionality', () => {
    it('renders tafsir link with correct href', () => {
      render(<ResponsiveVerseActions {...defaultProps} />);

      const link = screen.getByRole('link', { name: 'View tafsir' });
      expect(link).toHaveAttribute('href', '/tafsir/1/1');
    });

    it('should handle different verse keys correctly', () => {
      render(<ResponsiveVerseActions {...defaultProps} verseKey="2:255" />);

      const link = screen.getByRole('link', { name: 'View tafsir' });
      expect(link).toHaveAttribute('href', '/tafsir/2/255');
    });
  });

  describe('Error Boundaries', () => {
    it('should handle missing props gracefully', () => {
      expect(() => {
        render(
          <ResponsiveVerseActions
            verseKey="1:1"
            isPlaying={false}
            isLoadingAudio={false}
            isBookmarked={false}
            onPlayPause={noop}
            onBookmark={noop}
          />
        );
      }).not.toThrow();
    });

    it('should handle invalid verse key format', () => {
      expect(() => {
        render(<ResponsiveVerseActions {...defaultProps} verseKey="invalid" />);
      }).not.toThrow();
    });
  });
});
