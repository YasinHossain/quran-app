import { fireEvent, screen } from '@testing-library/react';
import React from 'react';

import { renderSurahView, mockUseSurahPanels, defaultPanels } from './SurahView/test-helpers';

// Open settings sidebar by default
jest.mock('@/app/providers/UIStateContext', () => ({
  useUIState: () => ({ isSettingsOpen: true, setSettingsOpen: jest.fn() }),
}));

describe('SurahView navigation', () => {
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

    fireEvent.click(screen.getByRole('button', { name: 'Sahih International' }));
    expect(openTranslationPanel).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'English' }));
    expect(openWordLanguagePanel).toHaveBeenCalled();
  });

  it('switches between translation and mushaf tabs', () => {
    renderSurahView();

    fireEvent.click(screen.getByRole('button', { name: 'Mushaf' }));
    expect(
      screen.getByText('Mushaf settings have been moved to the Translation tab.')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Translation' }));
    expect(screen.getByRole('button', { name: 'Sahih International' })).toBeInTheDocument();
  });
});
