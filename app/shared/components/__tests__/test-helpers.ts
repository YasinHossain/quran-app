import type { BreakpointKey, ComponentVariant } from '@/lib/responsive';

interface MockResponsiveState {
  variant: ComponentVariant;
  breakpoint: BreakpointKey;
}

export const mockResponsiveState: MockResponsiveState = {
  variant: 'expanded',
  breakpoint: 'desktop',
};

export const setResponsive = (
  breakpoint: BreakpointKey,
  variant: ComponentVariant = 'expanded'
): void => {
  mockResponsiveState.breakpoint = breakpoint;
  mockResponsiveState.variant = variant;
};

jest.mock('@/lib/responsive', () => ({
  useResponsiveState: () => mockResponsiveState,
  touchClasses: {
    target: 'min-h-touch min-w-touch',
    gesture: 'touch-manipulation select-none',
    focus: 'focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none',
    active: 'active:scale-95 transition-transform',
  },
}));

export { renderResponsive, devicePresets } from '../../../../lib/__tests__/responsive-test-utils';
