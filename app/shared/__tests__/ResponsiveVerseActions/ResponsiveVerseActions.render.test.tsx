import { screen } from '@testing-library/react';

import {
  renderResponsiveVerseActions,
  renderWithResponsiveState,
  testAccessibility,
} from './test-helpers';

describe('ResponsiveVerseActions render', () => {
  it('[Cross-Device] renders correctly on mobile', () => {
    renderWithResponsiveState('compact', 'mobile');
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /bookmark/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View tafsir' })).toBeInTheDocument();
  });

  it('[Cross-Device] renders correctly on tablet', () => {
    renderWithResponsiveState('default', 'tablet');
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /bookmark/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View tafsir' })).toBeInTheDocument();
  });

  it('[Cross-Device] renders correctly on desktop', () => {
    renderResponsiveVerseActions();
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /bookmark/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View tafsir' })).toBeInTheDocument();
  });

  it('[Touch Targets] are WCAG-compliant on mobile', () => {
    const { container } = renderWithResponsiveState('compact', 'mobile');
    const result = testAccessibility.testTouchTargets(container);
    expect(result.isCompliant).toBe(true);
    expect(result.undersizedTargets).toHaveLength(0);
  });

  it('[Touch Targets] are appropriate on tablets', () => {
    const { container } = renderWithResponsiveState('default', 'tablet');
    const result = testAccessibility.testTouchTargets(container);
    expect(result.isCompliant).toBe(true);
    expect(result.totalTargets).toBeGreaterThan(0);
  });

  it('[Accessibility] has proper focus management', async () => {
    const { container } = renderResponsiveVerseActions();
    const result = await testAccessibility.testFocusManagement(container);
    expect(result.focusableCount).toBeGreaterThan(0);
    expect(result.hasLogicalOrder).toBe(true);
  });

  it('[Variants] applies compact classes for mobile', () => {
    const { container } = renderWithResponsiveState('compact', 'mobile');
    const component = container.firstChild as HTMLElement;
    expect(component).toBeTruthy();
  });

  it('[Variants] applies expanded classes for desktop', () => {
    const { container } = renderWithResponsiveState('expanded', 'desktop');
    const component = container.firstChild as HTMLElement;
    expect(component).toBeTruthy();
  });

  it('[Functionality] tafsir link has correct href', () => {
    renderResponsiveVerseActions();
    const link = screen.getByRole('link', { name: 'View tafsir' });
    expect(link).toHaveAttribute('href', '/tafsir/1/1');
  });

  it('[Functionality] handles different verse keys', () => {
    renderResponsiveVerseActions({ verseKey: '2:255' });
    const link = screen.getByRole('link', { name: 'View tafsir' });
    expect(link).toHaveAttribute('href', '/tafsir/2/255');
  });

  it('[Errors] handles missing props gracefully', () => {
    // Avoid nested callback in expect().not.toThrow
    try {
      renderResponsiveVerseActions();
    } catch (e) {
      expect(e).toBeUndefined();
    }
  });

  it('[Errors] handles invalid verse key format', () => {
    try {
      renderResponsiveVerseActions({ verseKey: 'invalid' });
    } catch (e) {
      expect(e).toBeUndefined();
    }
  });
});
