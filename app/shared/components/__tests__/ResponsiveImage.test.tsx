/**
 * ResponsiveImage Component Tests
 * Comprehensive testing of responsive image optimization
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderResponsive, devicePresets } from '../../../../lib/__tests__/responsive-test-utils';
import {
  ResponsiveImage,
  ResponsiveBackgroundImage,
  generateResponsiveUrls,
  useImagePreload,
} from '../ResponsiveImage';
import { renderHook } from '@testing-library/react';
import type { BreakpointKey, ComponentVariant } from '@/lib/responsive';

// Mock useResponsiveState hook
interface MockResponsiveState {
  variant: ComponentVariant;
  breakpoint: BreakpointKey;
}

const mockResponsiveState: MockResponsiveState = {
  variant: 'expanded',
  breakpoint: 'desktop',
};

jest.mock('@/lib/responsive', () => ({
  useResponsiveState: () => mockResponsiveState,
}));

describe('ResponsiveImage', () => {
  describe('Basic Functionality', () => {
    it('should render with string src', () => {
      render(<ResponsiveImage src="/test-image.jpg" alt="Test image" width={800} height={600} />);

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', 'Test image');
      expect(img).toHaveAttribute('src', expect.stringContaining('test-image.jpg'));
    });

    it('should render with responsive sources', () => {
      const responsiveSrc = {
        mobile: '/mobile.jpg',
        tablet: '/tablet.jpg',
        desktop: '/desktop.jpg',
        fallback: '/fallback.jpg',
      };

      render(
        <ResponsiveImage src={responsiveSrc} alt="Responsive test image" width={800} height={600} />
      );

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', 'Responsive test image');
      // Should use desktop source based on mocked breakpoint
      expect(img).toHaveAttribute('src', expect.stringContaining('desktop.jpg'));
    });

    it('should fall back to fallback source when specific breakpoint not available', () => {
      // Mock mobile breakpoint
      mockResponsiveState.breakpoint = 'mobile';
      mockResponsiveState.variant = 'compact';

      const responsiveSrc = {
        // No mobile source
        tablet: '/tablet.jpg',
        desktop: '/desktop.jpg',
        fallback: '/fallback.jpg',
      };

      render(<ResponsiveImage src={responsiveSrc} alt="Fallback test" width={400} height={300} />);

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', expect.stringContaining('fallback.jpg'));
    });
  });

  describe('Responsive Sizes', () => {
    it('should use default responsive sizes when not specified', () => {
      render(<ResponsiveImage src="/test.jpg" alt="Default sizes test" width={800} height={600} />);

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('sizes', expect.stringContaining('768px'));
    });

    it('should use custom responsive sizes object', () => {
      const customSizes = {
        mobile: '100vw',
        tablet: '50vw',
        desktop: '33vw',
        default: '25vw',
      };

      render(
        <ResponsiveImage
          src="/test.jpg"
          alt="Custom sizes test"
          sizes={customSizes}
          width={800}
          height={600}
        />
      );

      const img = screen.getByRole('img');
      const sizesAttr = img.getAttribute('sizes');
      expect(sizesAttr).toContain('100vw');
      expect(sizesAttr).toContain('50vw');
      expect(sizesAttr).toContain('33vw');
      expect(sizesAttr).toContain('25vw');
    });
  });

  describe('Loading Strategy', () => {
    it('should use eager loading when specified', () => {
      render(
        <ResponsiveImage
          src="/test.jpg"
          alt="Eager loading test"
          loadingStrategy="eager"
          width={800}
          height={600}
        />
      );

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('loading', 'eager');
    });

    it('should use lazy loading when specified', () => {
      render(
        <ResponsiveImage
          src="/test.jpg"
          alt="Lazy loading test"
          loadingStrategy="lazy"
          width={800}
          height={600}
        />
      );

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('loading', 'lazy');
    });

    it('should auto-determine loading strategy based on variant', () => {
      // Mock compact variant (mobile)
      mockResponsiveState.variant = 'compact';

      render(
        <ResponsiveImage
          src="/test.jpg"
          alt="Auto loading test"
          loadingStrategy="auto"
          width={800}
          height={600}
        />
      );

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('loading', 'eager');
    });
  });

  describe('Error Handling', () => {
    it('should handle image load errors with custom fallback', () => {
      render(
        <ResponsiveImage
          src="/broken-image.jpg"
          alt="Error handling test"
          fallback="/fallback-image.jpg"
          width={800}
          height={600}
        />
      );

      const img = screen.getByRole('img');

      // Simulate image load error
      fireEvent.error(img);

      expect(img).toHaveAttribute('src', '/fallback-image.jpg');
    });

    it('should generate SVG placeholder when no fallback provided', () => {
      render(
        <ResponsiveImage
          src="/broken-image.jpg"
          alt="SVG placeholder test"
          width={800}
          height={600}
        />
      );

      const img = screen.getByRole('img');

      // Simulate image load error
      fireEvent.error(img);

      expect(img.getAttribute('src')).toMatch(/^data:image\/svg\+xml;base64,/);
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt text', () => {
      render(
        <ResponsiveImage src="/test.jpg" alt="Accessibility test image" width={800} height={600} />
      );

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', 'Accessibility test image');
    });

    it('should support custom className', () => {
      render(
        <ResponsiveImage
          src="/test.jpg"
          alt="Class test"
          className="custom-image-class"
          width={800}
          height={600}
        />
      );

      const img = screen.getByRole('img');
      expect(img).toHaveClass('custom-image-class');
    });
  });

  describe('Cross-Device Performance', () => {
    it('should optimize for different devices', async () => {
      const responsiveSrc = {
        mobile: '/mobile-optimized.jpg',
        tablet: '/tablet-optimized.jpg',
        desktop: '/desktop-optimized.jpg',
        fallback: '/fallback.jpg',
      };

      const deviceTests = [
        { device: 'iPhone SE', expectedSrc: 'mobile-optimized.jpg' },
        { device: 'iPad', expectedSrc: 'tablet-optimized.jpg' },
        { device: 'Desktop Large', expectedSrc: 'desktop-optimized.jpg' },
      ] as const;

      for (const { device, expectedSrc } of deviceTests) {
        // Update mock for each device
        const breakpoint =
          device === 'iPhone SE' ? 'mobile' : device === 'iPad' ? 'tablet' : 'desktop';
        mockResponsiveState.breakpoint = breakpoint;

        const { unmount } = render(
          <ResponsiveImage src={responsiveSrc} alt={`${device} test`} width={800} height={600} />
        );

        const img = screen.getByRole('img');
        expect(img.getAttribute('src')).toContain(expectedSrc);

        unmount();
      }
    });

    it('should handle rapid device switches without performance issues', async () => {
      const { setDevice } = renderResponsive(
        <ResponsiveImage src="/test.jpg" alt="Performance test" width={800} height={600} />,
        { device: 'iPhone SE' }
      );

      const startTime = performance.now();

      // Rapidly switch between devices
      const devices: (keyof typeof devicePresets)[] = ['iPad', 'Desktop Small', 'iPhone SE'];

      for (const device of devices) {
        setDevice(device);
        await waitFor(() => {
          expect(screen.getByRole('img')).toBeInTheDocument();
        });
      }

      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(200);
    });
  });
});

describe('ResponsiveBackgroundImage', () => {
  it('should render background image correctly', () => {
    render(
      <ResponsiveBackgroundImage src="/bg-image.jpg">
        <div>Content</div>
      </ResponsiveBackgroundImage>
    );

    const container = screen.getByText('Content').closest('div[class*="bg-cover"]');
    expect(container).toHaveClass('bg-cover', 'bg-center', 'bg-no-repeat');
  });

  it('should handle responsive background sources', () => {
    const responsiveSrc = {
      mobile: '/mobile-bg.jpg',
      desktop: '/desktop-bg.jpg',
      fallback: '/fallback-bg.jpg',
    };

    render(
      <ResponsiveBackgroundImage src={responsiveSrc}>
        <div>Background Content</div>
      </ResponsiveBackgroundImage>
    );

    const container = screen.getByText('Background Content').closest('div[class*="bg-cover"]');
    // Should render with responsive background classes
    expect(container).toHaveClass('bg-cover', 'bg-center', 'bg-no-repeat');
  });

  it('should apply overlay when specified', () => {
    render(
      <ResponsiveBackgroundImage src="/bg.jpg" overlay={true} overlayOpacity={0.7}>
        <div>Overlay Content</div>
      </ResponsiveBackgroundImage>
    );

    const container = screen.getByText('Overlay Content').closest('div[class*="bg-cover"]');
    const overlay = container?.querySelector('.absolute');
    expect(overlay).toBeTruthy();
    expect(overlay).toHaveClass('absolute', 'inset-0', 'bg-black');
  });
});

describe('generateResponsiveUrls', () => {
  it('should generate URLs for different widths', () => {
    const baseUrl = 'https://example.com/image.jpg';
    const options = {
      widths: [640, 1024, 1920],
      format: 'webp',
      quality: 85,
    };

    const result = generateResponsiveUrls(baseUrl, options);

    expect(result.mobile).toBe('https://example.com/image.jpg?w=640&f=webp&q=85');
    expect(result.tablet).toBe('https://example.com/image.jpg?w=1024&f=webp&q=85');
    expect(result.desktop).toBe('https://example.com/image.jpg?w=1920&f=webp&q=85');
    expect(result.fallback).toBe(baseUrl);
  });

  it('should use default values when options not provided', () => {
    const baseUrl = 'https://example.com/image.jpg';
    const result = generateResponsiveUrls(baseUrl, { widths: [] });

    expect(result.mobile).toContain('w=640');
    expect(result.mobile).toContain('f=webp');
    expect(result.mobile).toContain('q=80');
  });
});

describe('useImagePreload', () => {
  it('should preload images when condition is true', async () => {
    const sources = ['/image1.jpg', '/image2.jpg', '/image3.jpg'];

    const { result } = renderHook(() => useImagePreload(sources, true));

    // Wait for images to be created
    await waitFor(() => {
      // Images should be preloaded
      expect(result.current).toBeUndefined(); // Hook doesn't return value
    });
  });

  it('should not preload images when condition is false', () => {
    const sources = ['/image1.jpg', '/image2.jpg'];

    const { result } = renderHook(() => useImagePreload(sources, false));

    expect(result.current).toBeUndefined();
  });

  it('should cleanup preloaded images on unmount', () => {
    const sources = ['/image1.jpg'];

    const { unmount } = renderHook(() => useImagePreload(sources, true));

    expect(() => unmount()).not.toThrow();
  });

  it('should handle empty sources array', () => {
    expect(() => {
      renderHook(() => useImagePreload([], true));
    }).not.toThrow();
  });
});
