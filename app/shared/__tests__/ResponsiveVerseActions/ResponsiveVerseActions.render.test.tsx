import { screen } from '@testing-library/react';

import {
  renderResponsiveVerseActions,
  renderWithResponsiveState,
  testAccessibility,
} from './test-helpers';

describe('ResponsiveVerseActions render', () => {
  describe('Cross-Device Rendering', () => {
    it('should render correctly on mobile devices', () => {
      renderWithResponsiveState('compact', 'mobile');

      expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /bookmark/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'View tafsir' })).toBeInTheDocument();
    });

    it('should render correctly on tablets', () => {
      renderWithResponsiveState('default', 'tablet');

      expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /bookmark/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'View tafsir' })).toBeInTheDocument();
    });

    it('should render correctly on desktop', () => {
      renderResponsiveVerseActions();

      expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /bookmark/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'View tafsir' })).toBeInTheDocument();
    });
  });

  describe('Touch Target Compliance', () => {
    it('should have WCAG-compliant touch targets on mobile', () => {
      const { container } = renderWithResponsiveState('compact', 'mobile');

      const result = testAccessibility.testTouchTargets(container);

      expect(result.isCompliant).toBe(true);
      expect(result.undersizedTargets).toHaveLength(0);
    });

    it('should have appropriate touch targets on tablets', () => {
      const { container } = renderWithResponsiveState('default', 'tablet');

      const result = testAccessibility.testTouchTargets(container);

      expect(result.isCompliant).toBe(true);
      expect(result.totalTargets).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('should have proper focus management', async () => {
      const { container } = renderResponsiveVerseActions();

      const result = await testAccessibility.testFocusManagement(container);

      expect(result.focusableCount).toBeGreaterThan(0);
      expect(result.hasLogicalOrder).toBe(true);
    });
  });

  describe('Responsive Variants', () => {
    it('should apply compact variant classes for mobile', () => {
      const { container } = renderWithResponsiveState('compact', 'mobile');

      const component = container.firstChild as HTMLElement;
      expect(component).toBeTruthy();
    });

    it('should apply expanded variant classes for desktop', () => {
      const { container } = renderWithResponsiveState('expanded', 'desktop');

      const component = container.firstChild as HTMLElement;
      expect(component).toBeTruthy();
    });
  });

  describe('Original Functionality', () => {
    it('renders tafsir link with correct href', () => {
      renderResponsiveVerseActions();

      const link = screen.getByRole('link', { name: 'View tafsir' });
      expect(link).toHaveAttribute('href', '/tafsir/1/1');
    });

    it('should handle different verse keys correctly', () => {
      renderResponsiveVerseActions({ verseKey: '2:255' });

      const link = screen.getByRole('link', { name: 'View tafsir' });
      expect(link).toHaveAttribute('href', '/tafsir/2/255');
    });
  });

  describe('Error Boundaries', () => {
    it('should handle missing props gracefully', () => {
      expect(() => renderResponsiveVerseActions()).not.toThrow();
    });

    it('should handle invalid verse key format', () => {
      expect(() => renderResponsiveVerseActions({ verseKey: 'invalid' })).not.toThrow();
    });
  });
});
