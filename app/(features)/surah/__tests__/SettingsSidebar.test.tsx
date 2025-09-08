import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useState } from 'react';

import { HeaderVisibilityProvider } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { SettingsSidebar, TranslationPanel } from '@/app/(features)/surah/components';
import { Header } from '@/app/shared/Header';
import { renderWithProviders } from '@/app/testUtils/renderWithProviders';
import { logger } from '@/src/infrastructure/monitoring/Logger';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/',
}));

const Wrapper = ({ children }: { children: React.ReactNode }): React.ReactElement => (
  <HeaderVisibilityProvider>{children}</HeaderVisibilityProvider>
);

function createTestComponent(props: {
  onTranslationPanelOpen?: () => void;
  onWordLanguagePanelOpen?: () => void;
  isWordLanguagePanelOpen?: boolean;
  onWordLanguagePanelClose?: () => void;
}): React.ReactElement {
  return (
    <Wrapper>
      <Header />
      <SettingsSidebar
        onTranslationPanelOpen={props.onTranslationPanelOpen || (() => {})}
        onWordLanguagePanelOpen={props.onWordLanguagePanelOpen || (() => {})}
        selectedTranslationName="English"
        selectedWordLanguageName="English"
        isWordLanguagePanelOpen={props.isWordLanguagePanelOpen}
        onWordLanguagePanelClose={props.onWordLanguagePanelClose}
      />
    </Wrapper>
  );
}

let errorSpy: jest.SpyInstance;

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
  errorSpy = jest.spyOn(logger, 'error').mockImplementation(() => {});
});

afterAll(() => {
  errorSpy.mockRestore();
});

beforeEach(() => {
  localStorage.clear();
});

describe('SettingsSidebar - Basic Interactions', () => {
  it('opens and closes via header icon', async () => {
    renderWithProviders(createTestComponent({}));

    const aside = document.querySelector('aside');
    expect(aside?.className).toContain('translate-x-full');

    await userEvent.click(screen.getByLabelText('Open Settings'));
    expect(await screen.findByText('reading_setting')).toBeInTheDocument();

    const backButtons = screen.getAllByRole('button', { name: 'Back' });
    await userEvent.click(backButtons[1]);
  });

  it('switches font tabs correctly', async () => {
    renderWithProviders(createTestComponent({}));

    await userEvent.click(screen.getByLabelText('Open Settings'));
    const [fontButton] = screen.getAllByRole('button', { name: 'KFGQPC Uthman Taha' });
    await userEvent.click(fontButton);

    await userEvent.click(screen.getByRole('button', { name: 'IndoPak' }));
    expect(screen.getByText('Noto Nastaliq Urdu')).toBeInTheDocument();
  });
});

describe('SettingsSidebar - Translation Panel', () => {
  it('clicking translation tab does not open translation panel', async () => {
    const TestComponent = (): React.ReactElement => {
      const [open, setOpen] = useState(false);
      return (
        <Wrapper>
          <Header />
          <SettingsSidebar
            onTranslationPanelOpen={() => setOpen(true)}
            onWordLanguagePanelOpen={() => {}}
            selectedTranslationName="English"
            selectedWordLanguageName="English"
          />
          <TranslationPanel isOpen={open} onClose={() => setOpen(false)} />
        </Wrapper>
      );
    };

    renderWithProviders(<TestComponent />);

    await userEvent.click(screen.getByLabelText('Open Settings'));
    await userEvent.click(screen.getAllByRole('button', { name: 'Translation' })[0]);
    const panel = screen.getByTestId('translation-panel');
    expect(panel).toHaveClass('translate-x-full');
  });
});

describe('SettingsSidebar - Word Translation Panel', () => {
  it('opens and shows languages', async () => {
    const TestComponent = (): React.ReactElement => {
      const [open, setOpen] = useState(false);
      return (
        <Wrapper>
          <Header />
          <SettingsSidebar
            onTranslationPanelOpen={() => {}}
            onWordLanguagePanelOpen={() => setOpen(true)}
            selectedTranslationName="English"
            selectedWordLanguageName="Bangla"
            isWordLanguagePanelOpen={open}
            onWordLanguagePanelClose={() => setOpen(false)}
          />
        </Wrapper>
      );
    };

    renderWithProviders(<TestComponent />);

    await userEvent.click(screen.getByLabelText('Open Settings'));
    const [banglaButton] = await screen.findAllByRole('button', { name: 'Bangla' });
    await userEvent.click(banglaButton);
    expect(screen.getAllByText('Bangla').length).toBeGreaterThan(1);
  });
});
