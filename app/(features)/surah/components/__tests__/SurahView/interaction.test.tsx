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

    const translationButton = screen.getAllByLabelText<HTMLButtonElement>('translations')[0];
    fireEvent.click(translationButton);
    expect(openTranslationPanel).toHaveBeenCalled();

    const wordLanguageButton =
      screen.getAllByLabelText<HTMLButtonElement>('word_by_word_language')[0];
    fireEvent.click(wordLanguageButton);
    expect(openWordLanguagePanel).toHaveBeenCalled();
  });

  it('switches between translation and mushaf tabs', () => {
    renderSurahView();

    const mushafButton = screen.getAllByRole<HTMLButtonElement>('button', { name: 'Mushaf' })[0];
    fireEvent.click(mushafButton);
    expect(
      screen.getByText('Mushaf settings have been moved to the Translation tab.')
    ).toBeInTheDocument();

    const translationButton = screen.getAllByRole<HTMLButtonElement>('button', {
      name: 'Translation',
    })[0];
    fireEvent.click(translationButton);
    expect(screen.getAllByLabelText('translations')[0]).toBeInTheDocument();
  });
});
