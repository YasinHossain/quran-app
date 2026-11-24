import { screen } from '@testing-library/react';

import { renderSurahView } from './test-utils';

describe('SurahView accessibility', () => {
  it('provides screen reader support', () => {
    renderSurahView();
    expect(screen.getByLabelText('Settings panel')).toBeInTheDocument();
  });
});
