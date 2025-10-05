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

    const translationButton = screen.getByLabelText<HTMLButtonElement>('translations');
    fireEvent.click(translationButton);
    expect(openTranslationPanel).toHaveBeenCalled();

    const wordLanguageButton = screen.getByLabelText<HTMLButtonElement>('word_by_word_language');
    fireEvent.click(wordLanguageButton);
    expect(openWordLanguagePanel).toHaveBeenCalled();
  });

  it('switches between translation and mushaf tabs', () => {
    renderSurahView();

    const mushafButton = screen.getByRole<HTMLButtonElement>('button', { name: 'Mushaf' });
    fireEvent.click(mushafButton);
    expect(
      screen.getByText('Mushaf settings have been moved to the Translation tab.')
    ).toBeInTheDocument();

    const translationButton = screen.getByRole<HTMLButtonElement>('button', {
      name: 'Translation',
    });
    fireEvent.click(translationButton);
    expect(screen.getByLabelText('translations')).toBeInTheDocument();
  });
});
