'use client';

import React from 'react';

import { renderWithProvidersAsync, screen } from '@/app/testUtils/renderWithProviders';
import * as chaptersApi from '@/lib/api/chapters';

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
  it('renders without the hero card', async () => {
    const { container } = await renderWithProvidersAsync(<MushafMain {...baseProps} />);

    expect(container.firstChild).toBeInTheDocument();
    expect(screen.queryByText('Mushaf reading')).not.toBeInTheDocument();
  });

  it('shows surah intro with metadata and bismillah', async () => {
    (chaptersApi.getChapters as jest.Mock).mockResolvedValue([
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

    expect(await screen.findByText('المائدة')).toBeInTheDocument();
    expect(screen.getByText('The Table Spread')).toBeInTheDocument();
    expect(screen.getByText('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ')).toBeInTheDocument();
  });

  it('omits bismillah for At-Tawbah (surah 9)', async () => {
    await renderWithProvidersAsync(<MushafMain {...baseProps} chapterId={9} />);

    expect(screen.queryByText('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ')).not.toBeInTheDocument();
  });
});
