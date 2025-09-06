import { screen } from '@testing-library/react';
import {
  renderSurahView,
  mockUseVerseListing,
  defaultVerseListing,
} from './test-utils';

describe('SurahView error handling', () => {
  afterEach(() => {
    mockUseVerseListing.mockReturnValue(defaultVerseListing);
  });

  it('handles API errors gracefully', () => {
    mockUseVerseListing.mockReturnValue({
      ...defaultVerseListing,
      error: 'Failed to load verses',
      verses: [],
    });

    renderSurahView();
    expect(screen.getByText(/failed/i)).toBeInTheDocument();
  });
});
