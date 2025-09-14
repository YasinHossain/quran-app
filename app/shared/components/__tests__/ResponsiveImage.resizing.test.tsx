import { render, screen } from '@testing-library/react';
import React from 'react';

import { ResponsiveImage } from '@/app/shared/components/responsive-image/ResponsiveImage';

import { setResponsive } from './test-helpers';

// Mock the responsive hook to use our test state
jest.mock('@/lib/responsive', () => {
  const helpers = require('./test-helpers');
  return {
    useResponsiveState: () => helpers.mockResponsiveState,
    touchClasses: {
      target: 'min-h-touch min-w-touch',
      gesture: 'touch-manipulation select-none',
      focus: 'focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none',
      active: 'active:scale-95 transition-transform',
    },
  };
});

describe('ResponsiveImage - resizing', () => {
  const responsiveSrc = {
    mobile: '/mobile.jpg',
    tablet: '/tablet.jpg',
    desktop: '/desktop.jpg',
    fallback: '/fallback.jpg',
  };

  afterEach(() => {
    setResponsive('desktop');
  });

  it('renders desktop source by default', () => {
    setResponsive('desktop');
    render(<ResponsiveImage src={responsiveSrc} alt="test" width={800} height={600} />);
    expect(screen.getByRole('img')).toHaveAttribute('src', expect.stringContaining('desktop.jpg'));
  });

  it('renders mobile source on mobile breakpoint', () => {
    setResponsive('mobile', 'compact');
    render(<ResponsiveImage src={responsiveSrc} alt="mobile" width={800} height={600} />);
    expect(screen.getByRole('img')).toHaveAttribute('src', expect.stringContaining('mobile.jpg'));
  });

  it('falls back when source missing for breakpoint', () => {
    setResponsive('mobile', 'compact');
    const sources = {
      tablet: '/tablet.jpg',
      desktop: '/desktop.jpg',
      fallback: '/fallback.jpg',
    };
    render(<ResponsiveImage src={sources} alt="fallback" width={800} height={600} />);
    expect(screen.getByRole('img')).toHaveAttribute('src', expect.stringContaining('fallback.jpg'));
  });

  it('updates source when breakpoint changes', () => {
    setResponsive('desktop');
    const { rerender } = render(
      <ResponsiveImage src={responsiveSrc} alt="update" width={800} height={600} />
    );
    expect(screen.getByRole('img')).toHaveAttribute('src', expect.stringContaining('desktop.jpg'));

    setResponsive('tablet');
    rerender(<ResponsiveImage src={responsiveSrc} alt="update" width={800} height={600} />);
    expect(screen.getByRole('img')).toHaveAttribute('src', expect.stringContaining('tablet.jpg'));
  });
});
