import { renderHook } from '@testing-library/react';
import { useBreakpoint, layoutPatterns } from '../responsive';

const createMatchMedia = (width: number) => (query: string) => ({
  matches: width >= parseInt(query.match(/\d+/)![0], 10),
  media: query,
  onchange: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

describe('useBreakpoint', () => {
  it('returns mobile when width is below 768px', () => {
    window.matchMedia = jest.fn(createMatchMedia(500)) as any;
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toBe('mobile');
  });

  it('returns tablet when width is between 768px and 1023px', () => {
    window.matchMedia = jest.fn(createMatchMedia(800)) as any;
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toBe('tablet');
  });

  it('returns desktop when width is between 1024px and 1279px', () => {
    window.matchMedia = jest.fn(createMatchMedia(1100)) as any;
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toBe('desktop');
  });

  it('returns wide when width is at least 1280px', () => {
    window.matchMedia = jest.fn(createMatchMedia(1300)) as any;
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toBe('wide');
  });
});

describe('layoutPatterns.adaptiveHeader', () => {
  it('includes pt-safe for mobile and tablet', () => {
    expect(layoutPatterns.adaptiveHeader.mobile).toContain('pt-safe');
    expect(layoutPatterns.adaptiveHeader.tablet).toContain('pt-safe');
  });
});
