import { testAccessibility } from '../../../../lib/__tests__/responsive-test-utils';

import type { VerseActionsProps } from '../../ResponsiveVerseActions';

export const noop = () => {};

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

const mockResponsiveState = (variant: string, breakpoint: string) => ({
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

export const setMockVariant = (variant: string) => {
  mockVariant = variant;
};

export const setMockBreakpoint = (breakpoint: string) => {
  mockBreakpoint = breakpoint;
};

beforeEach(() => {
  mockVariant = 'expanded';
  mockBreakpoint = 'desktop';
});

export { testAccessibility };
