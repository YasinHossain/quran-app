import { screen } from '@testing-library/react';
import {
  renderSurahView,
  mockUseVerseListing,
  defaultVerseListing,
} from './test-utils';

describe('SurahView loading', () => {
  afterEach(() => {
    mockUseVerseListing.mockReturnValue(defaultVerseListing);
  });

  it('displays loading indicator', () => {
    mockUseVerseListing.mockReturnValue({
      ...defaultVerseListing,
      isLoading: true,
      verses: [],
    });

    renderSurahView();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
