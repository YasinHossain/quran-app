'use client';

import React from 'react';

import { renderWithProviders, screen } from '@/app/testUtils/renderWithProviders';

import { MushafMain } from '../MushafMain';

const baseProps = {
  mushafName: 'King Fahad Complex V1',
  mushafId: 'qcf-madani-v1',
  pages: [],
  chapterId: 1,
  isLoading: false,
  isLoadingMore: false,
  hasMore: false,
  onLoadMore: jest.fn(),
  error: null as string | null,
};

describe('MushafMain', () => {
  it('renders a hero even when there are no pages yet', () => {
    const { container } = renderWithProviders(<MushafMain {...baseProps} />);

    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByText('Mushaf reading')).toBeInTheDocument();
    expect(screen.getByText(baseProps.mushafName)).toBeInTheDocument();
  });
});
