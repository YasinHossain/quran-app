import { render } from '@testing-library/react';
import React from 'react';

import { ResponsiveVerseActions } from '@/app/shared/ResponsiveVerseActions';
import { renderWithBookmarks } from '@/app/testUtils/lightweightProviders';
import { testAccessibility } from '@/lib/__tests__/responsive-test-utils';

import type { VerseActionsProps } from '@/app/shared/ResponsiveVerseActions';

export const noop = (): void => {};

export const defaultProps: VerseActionsProps = {
  verseKey: '1:1',
  isPlaying: false,
  isLoadingAudio: false,
  isBookmarked: false,
  onPlayPause: noop,
  onBookmark: noop,
};

let mockVariant = 'expanded';
let mockBreakpoint = 'desktop';

const mockResponsiveState = (
  variant: string,
  breakpoint: string
): {
  variant: string;
  breakpoint: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
} => ({
  variant,
  breakpoint,
  isMobile: breakpoint === 'mobile',
  isTablet: breakpoint === 'tablet',
  isDesktop: ['desktop', 'wide'].includes(breakpoint),
});

jest.mock('@/lib/responsive', () => ({
  useResponsiveState: () => mockResponsiveState(mockVariant, mockBreakpoint),
  touchClasses: {
    target: 'min-h-touch min-w-touch',
    gesture: 'touch-manipulation select-none',
    focus: 'focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none',
    active: 'active:scale-95 transition-transform',
  },
}));

export const setMockVariant = (variant: string): void => {
  mockVariant = variant;
};

export const setMockBreakpoint = (breakpoint: string): void => {
  mockBreakpoint = breakpoint;
};

export const renderResponsiveVerseActions = (
  props: Partial<VerseActionsProps> = {}
): ReturnType<typeof render> =>
  renderWithBookmarks(<ResponsiveVerseActions {...defaultProps} {...props} />);

export const rerenderResponsiveVerseActions = (
  rerender: (ui: React.ReactElement) => void,
  props: Partial<VerseActionsProps> = {}
): void => rerender(<ResponsiveVerseActions {...defaultProps} {...props} />);

export const renderWithResponsiveState = (
  variant: string,
  breakpoint: string,
  props: Partial<VerseActionsProps> = {}
): ReturnType<typeof renderResponsiveVerseActions> => {
  setMockVariant(variant);
  setMockBreakpoint(breakpoint);
  return renderResponsiveVerseActions(props);
};

beforeEach(() => {
  mockVariant = 'expanded';
  mockBreakpoint = 'desktop';
});

export { testAccessibility };
