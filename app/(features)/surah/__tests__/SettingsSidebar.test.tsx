import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useState } from 'react';

import { HeaderVisibilityProvider } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { SettingsSidebar, TranslationPanel } from '@/app/(features)/surah/components';
import { Header } from '@/app/shared/Header';
import { setMatchMedia } from '@/app/testUtils/matchMedia';
import { renderWithProviders } from '@/app/testUtils/renderWithProviders';
import { logger } from '@/src/infrastructure/monitoring/Logger';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const Wrapper = ({ children }: { children: React.ReactNode }): React.ReactElement => (
  <HeaderVisibilityProvider>{children}</HeaderVisibilityProvider>
);

const noop = (): void => {};

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
        onTranslationPanelOpen={props.onTranslationPanelOpen ?? noop}
        onWordLanguagePanelOpen={props.onWordLanguagePanelOpen ?? noop}
        selectedTranslationName="English"
        selectedWordLanguageName="English"
        isWordLanguagePanelOpen={props.isWordLanguagePanelOpen ?? false}
        onWordLanguagePanelClose={props.onWordLanguagePanelClose ?? noop}
      />
    </Wrapper>
  );
}

let errorSpy: jest.SpyInstance;

beforeAll(() => {
  setMatchMedia(false);
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

    await userEvent.click(screen.getByLabelText(/open settings/i));
    expect(await screen.findByText('reading_setting')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /close sidebar/i }));
  });

  it('switches font tabs correctly', async () => {
    renderWithProviders(createTestComponent({}));

    await userEvent.click(screen.getByLabelText(/open settings/i));
    const fontButton = screen.getByRole<HTMLButtonElement>('button', {
      name: /arabic_font_face/i,
    });
    expect(fontButton).toHaveTextContent('KFGQPC Uthman Taha');
    await userEvent.click(fontButton);

    const indoPakButton = screen.getByRole<HTMLButtonElement>('button', { name: 'IndoPak' });
    await userEvent.click(indoPakButton);
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

    await userEvent.click(screen.getByLabelText(/open settings/i));
    const translationButton = screen.getAllByRole<HTMLButtonElement>('button', {
      name: 'Translation',
    })[0]!;
    await userEvent.click(translationButton);
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

    await userEvent.click(screen.getByLabelText(/open settings/i));
    const banglaButton = await screen.findByRole<HTMLButtonElement>('button', {
      name: /word_by_word_language/i,
    });
    expect(banglaButton).toHaveTextContent('Bangla');
    await userEvent.click(banglaButton);
    expect(screen.getAllByText('Bangla').length).toBeGreaterThan(1);
  });
});
