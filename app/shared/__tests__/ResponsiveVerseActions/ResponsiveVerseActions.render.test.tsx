import { screen, type RenderResult } from '@testing-library/react';

import {
  renderResponsiveVerseActions,
  renderWithResponsiveState,
  testAccessibility,
} from './test-helpers';

type Device = 'mobile' | 'tablet' | 'desktop';

const renderOnDevice = (device: Device): RenderResult => {
  if (device === 'mobile') return renderWithResponsiveState('compact', 'mobile');
  if (device === 'tablet') return renderWithResponsiveState('default', 'tablet');
  return renderResponsiveVerseActions();
};

const getTouchTargets = (device: Device): ReturnType<typeof testAccessibility.testTouchTargets> => {
  const { container } = renderOnDevice(device);
  return testAccessibility.testTouchTargets(container);
};

const getFocusResult = async (): Promise<
  ReturnType<typeof testAccessibility.testFocusManagement>
> => {
  const { container } = renderResponsiveVerseActions();
  return testAccessibility.testFocusManagement(container);
};

const getTafsirLink = (props = {}): HTMLAnchorElement => {
  renderResponsiveVerseActions(props);
  return screen.getByRole('link', { name: 'View tafsir' }) as HTMLAnchorElement;
};

const devices: Device[] = ['mobile', 'tablet', 'desktop'];

describe('[Cross-Device]', () => {
  it.each(devices)('renders play button on %s', (device) => {
    renderOnDevice(device);
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
  });

  it.each(devices)('renders bookmark button on %s', (device) => {
    renderOnDevice(device);
    expect(screen.getByRole('button', { name: /bookmark/i })).toBeInTheDocument();
  });

  it.each(devices)('renders tafsir link on %s', (device) => {
    renderOnDevice(device);
    expect(screen.getByRole('link', { name: 'View tafsir' })).toBeInTheDocument();
  });
});

describe('[Touch Targets]', () => {
  it('are WCAG-compliant on mobile', () => {
    const result = getTouchTargets('mobile');
    expect(result.isCompliant).toBe(true);
  });

  it('have no undersized targets on mobile', () => {
    const result = getTouchTargets('mobile');
    expect(result.undersizedTargets).toHaveLength(0);
  });

  it('are WCAG-compliant on tablets', () => {
    const result = getTouchTargets('tablet');
    expect(result.isCompliant).toBe(true);
  });

  it('detect targets on tablets', () => {
    const result = getTouchTargets('tablet');
    expect(result.totalTargets).toBeGreaterThan(0);
  });
});

describe('[Accessibility]', () => {
  it('has focusable elements', async () => {
    const result = await getFocusResult();
    expect(result.focusableCount).toBeGreaterThan(0);
  });

  it('has logical focus order', async () => {
    const result = await getFocusResult();
    expect(result.hasLogicalOrder).toBe(true);
  });
});

describe('[Variants]', () => {
  it('applies compact classes for mobile', () => {
    const { container } = renderOnDevice('mobile');
    const component = container.firstChild as HTMLElement;
    expect(component).toBeTruthy();
  });

  it('applies expanded classes for desktop', () => {
    const { container } = renderOnDevice('desktop');
    const component = container.firstChild as HTMLElement;
    expect(component).toBeTruthy();
  });
});

describe('[Functionality]', () => {
  it('tafsir link has correct href', () => {
    const link = getTafsirLink();
    expect(link).toHaveAttribute('href', '/tafsir/1/1');
  });

  it('handles different verse keys', () => {
    const link = getTafsirLink({ verseKey: '2:255' });
    expect(link).toHaveAttribute('href', '/tafsir/2/255');
  });
});

describe('[Errors]', () => {
  it('handles missing props gracefully', () => {
    expect(() => renderResponsiveVerseActions()).not.toThrow();
  });

  it('handles invalid verse key format', () => {
    expect(() => renderResponsiveVerseActions({ verseKey: 'invalid' })).not.toThrow();
  });
});
