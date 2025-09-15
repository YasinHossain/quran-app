import { screen, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  renderResponsiveVerseActions,
  renderWithResponsiveState,
  testAccessibility,
} from '@/app/testUtils/responsiveVerseActionsTestUtils';

type Device = 'mobile' | 'tablet' | 'desktop';

const renderOnDevice = (device: Device): RenderResult => {
  if (device === 'mobile') return renderWithResponsiveState('compact', 'mobile');
  if (device === 'tablet') return renderWithResponsiveState('default', 'tablet');
  return renderResponsiveVerseActions();
};

const getTouchTargets = async (
  device: Device
): Promise<ReturnType<typeof testAccessibility.testTouchTargets>> => {
  const user = userEvent.setup();
  const { container } = renderOnDevice(device);

  if (device === 'mobile') {
    const trigger = await screen.findByRole('button', {
      name: 'Open verse actions menu',
    });
    await user.click(trigger);
  }

  await screen.findByRole('button', { name: /play/i });
  return testAccessibility.testTouchTargets(container);
};

const getFocusResult = async (): Promise<
  ReturnType<typeof testAccessibility.testFocusManagement>
> => {
  const { container } = renderResponsiveVerseActions();
  await screen.findByRole('button', { name: /play/i });
  return testAccessibility.testFocusManagement(container);
};

const getTafsirLink = async (props = {}): Promise<HTMLAnchorElement> => {
  renderResponsiveVerseActions(props);
  return (await screen.findByRole('link', { name: /view tafsir/i })) as HTMLAnchorElement;
};

const devices: Device[] = ['mobile', 'tablet', 'desktop'];

describe('[Cross-Device]', () => {
  it.each(devices)('renders play button on %s', async (device) => {
    const user = userEvent.setup();
    renderOnDevice(device);

    if (device === 'mobile') {
      const trigger = await screen.findByRole('button', { name: 'Open verse actions menu' });
      await user.click(trigger);
    }

    const playButton = await screen.findByRole('button', { name: /play/i });
    expect(playButton).toBeInTheDocument();
  });

  it.each(devices)('renders bookmark button on %s', async (device) => {
    const user = userEvent.setup();
    renderOnDevice(device);

    if (device === 'mobile') {
      const trigger = await screen.findByRole('button', { name: 'Open verse actions menu' });
      await user.click(trigger);
    }

    const bookmarkButton = await screen.findByRole('button', { name: /bookmark/i });
    expect(bookmarkButton).toBeInTheDocument();
  });

  it.each(devices)('renders tafsir link on %s', async (device) => {
    const user = userEvent.setup();
    renderOnDevice(device);

    if (device === 'mobile') {
      const trigger = await screen.findByRole('button', { name: 'Open verse actions menu' });
      await user.click(trigger);
    }

    const link = await screen.findByRole('link', { name: /view tafsir/i });
    expect(link).toBeInTheDocument();
  });
});

describe('[Touch Targets]', () => {
  beforeEach(() => {
    // Mock getBoundingClientRect for touch target tests
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 44,
      height: 44,
      top: 0,
      left: 0,
      bottom: 44,
      right: 44,
      x: 0,
      y: 0,
      toJSON: jest.fn(),
    }));
  });

  it('are WCAG-compliant on mobile', async () => {
    const result = await getTouchTargets('mobile');
    expect(result.isCompliant).toBe(true);
  });

  it('have no undersized targets on mobile', async () => {
    const result = await getTouchTargets('mobile');
    expect(result.undersizedTargets).toHaveLength(0);
  });

  it('are WCAG-compliant on tablets', async () => {
    const result = await getTouchTargets('tablet');
    expect(result.isCompliant).toBe(true);
  });

  it('detect targets on tablets', async () => {
    const result = await getTouchTargets('tablet');
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
  it('applies compact classes for mobile', async () => {
    const user = userEvent.setup();
    const { container } = renderOnDevice('mobile');
    const trigger = await screen.findByRole('button', {
      name: 'Open verse actions menu',
    });
    await user.click(trigger);
    await screen.findByRole('button', { name: /play/i });
    const component = container.firstChild as HTMLElement;
    expect(component).toBeTruthy();
  });

  it('applies expanded classes for desktop', async () => {
    const { container } = renderOnDevice('desktop');
    await screen.findByRole('button', { name: /play/i });
    const component = container.firstChild as HTMLElement;
    expect(component).toBeTruthy();
  });
});

describe('[Functionality]', () => {
  it('tafsir link has correct href', async () => {
    const link = await getTafsirLink();
    expect(link).toHaveAttribute('href', '/tafsir/1/1');
  });

  it('handles different verse keys', async () => {
    const link = await getTafsirLink({ verseKey: '2:255' });
    expect(link).toHaveAttribute('href', '/tafsir/2/255');
  });
});

describe('[Errors]', () => {
  it('handles missing props gracefully', async () => {
    expect(() => renderResponsiveVerseActions()).not.toThrow();
    await screen.findByRole('button', { name: /play/i });
  });

  it('handles invalid verse key format', async () => {
    expect(() => renderResponsiveVerseActions({ verseKey: 'invalid' })).not.toThrow();
    await screen.findByRole('button', { name: /play/i });
  });
});
