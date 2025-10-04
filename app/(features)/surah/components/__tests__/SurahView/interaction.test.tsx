import { fireEvent, screen } from '@testing-library/react';

import { renderSurahView, mockUseSurahPanels, defaultPanels } from './test-utils';

jest.mock('@/app/providers/UIStateContext', () => ({
  useUIState: () => ({ isSettingsOpen: true, setSettingsOpen: jest.fn() }),
  UIStateProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('SurahView interaction', () => {
  beforeEach(() => {
    mockUseSurahPanels.mockReturnValue({ ...defaultPanels });
  });

  it('opens translation and word language panels', () => {
    const openTranslationPanel = jest.fn();
    const openWordLanguagePanel = jest.fn();
    mockUseSurahPanels.mockReturnValue({
      ...defaultPanels,
      openTranslationPanel,
      openWordLanguagePanel,
    });

    renderSurahView();

    const translationButton = screen.getByRole<HTMLButtonElement>('button', { name: 'Sahih International' });
    fireEvent.click(translationButton);
    expect(openTranslationPanel).toHaveBeenCalled();

    const englishButtons = screen.getAllByRole<HTMLButtonElement>('button', { name: 'English' });
    const englishButton = englishButtons[0];
    if (!englishButton) {
      throw new Error('Expected English button');
    }
    fireEvent.click(englishButton);
    expect(openWordLanguagePanel).toHaveBeenCalled();
  });

  it('switches between translation and mushaf tabs', () => {
    renderSurahView();

    const mushafButton = screen.getByRole<HTMLButtonElement>('button', { name: 'Mushaf' });
    fireEvent.click(mushafButton);
    expect(
      screen.getByText('Mushaf settings have been moved to the Translation tab.')
    ).toBeInTheDocument();

    const translationButton = screen.getByRole<HTMLButtonElement>('button', { name: 'Translation' });
    fireEvent.click(translationButton);
    expect(screen.getByRole('button', { name: 'Sahih International' })).toBeInTheDocument();
  });
});
