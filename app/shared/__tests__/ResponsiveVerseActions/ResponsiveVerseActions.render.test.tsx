import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { ResponsiveVerseActions } from '../../ResponsiveVerseActions';
import {
  defaultProps,
  setMockVariant,
  setMockBreakpoint,
  testAccessibility,
} from './test-helpers';

describe('ResponsiveVerseActions render', () => {
  describe('Cross-Device Rendering', () => {
    it('should render correctly on mobile devices', () => {
      setMockVariant('compact');
      setMockBreakpoint('mobile');

      render(<ResponsiveVerseActions {...defaultProps} />);

      expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /bookmark/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'View tafsir' })).toBeInTheDocument();
    });

    it('should render correctly on tablets', () => {
      setMockVariant('default');
      setMockBreakpoint('tablet');

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
      setMockVariant('compact');
      setMockBreakpoint('mobile');

      const { container } = render(<ResponsiveVerseActions {...defaultProps} />);

      const result = testAccessibility.testTouchTargets(container);

      expect(result.isCompliant).toBe(true);
      expect(result.undersizedTargets).toHaveLength(0);
    });

    it('should have appropriate touch targets on tablets', () => {
      setMockVariant('default');
      setMockBreakpoint('tablet');

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

  describe('Responsive Variants', () => {
    it('should apply compact variant classes for mobile', () => {
      setMockVariant('compact');
      setMockBreakpoint('mobile');

      const { container } = render(<ResponsiveVerseActions {...defaultProps} />);

      const component = container.firstChild as HTMLElement;
      expect(component).toBeTruthy();
    });

    it('should apply expanded variant classes for desktop', () => {
      setMockVariant('expanded');
      setMockBreakpoint('desktop');

      const { container } = render(<ResponsiveVerseActions {...defaultProps} />);

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
            onPlayPause={defaultProps.onPlayPause}
            onBookmark={defaultProps.onBookmark}
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
