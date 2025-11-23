'use client';

import React from 'react';

import { renderWithProvidersAsync, screen } from '@/app/testUtils/renderWithProviders';
import * as api from '@/lib/api';

import { MushafMain } from '../MushafMain';

jest.mock('@/lib/api', () => ({
  ...jest.requireActual('@/lib/api'),
  getChapters: jest.fn(),
}));

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
  it('renders without the hero card', async () => {
    const { container } = await renderWithProvidersAsync(<MushafMain {...baseProps} />);

    expect(container.firstChild).toBeInTheDocument();
    expect(screen.queryByText('Mushaf reading')).not.toBeInTheDocument();
  });

  it('shows surah intro with metadata and bismillah', async () => {
    (api.getChapters as jest.Mock).mockResolvedValue([
      {
        id: 5,
        name_simple: "Al-Ma'idah",
        name_arabic: 'المائدة',
        revelation_place: 'madinah',
        verses_count: 120,
        translated_name: { name: 'The Table Spread' },
      },
    ]);

    await renderWithProvidersAsync(<MushafMain {...baseProps} chapterId={5} />);

    expect(await screen.findByText('The Table Spread')).toBeInTheDocument();
    expect(screen.getByText('مدنية')).toBeInTheDocument();
    expect(screen.getByText('The Table Spread')).toBeInTheDocument();
    expect(screen.getByText('120 Verses')).toBeInTheDocument();
    expect(screen.getByText('﷽')).toBeInTheDocument();
  });

  it('omits bismillah for At-Tawbah (surah 9)', async () => {
    await renderWithProvidersAsync(<MushafMain {...baseProps} chapterId={9} />);

    expect(screen.queryByText('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ')).not.toBeInTheDocument();
  });
});
