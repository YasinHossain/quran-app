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
) => {
  mockResponsiveState.breakpoint = breakpoint;
  mockResponsiveState.variant = variant;
};

jest.mock('@/lib/responsive', () => ({
  useResponsiveState: () => mockResponsiveState,
}));

export { renderResponsive, devicePresets } from '../../../../lib/__tests__/responsive-test-utils';
