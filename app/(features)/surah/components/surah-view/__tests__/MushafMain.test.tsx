'use client';

import React from 'react';

import { MushafMain } from '@/app/(features)/surah/components/surah-view/MushafMain';
import { useDedupedFetchMushafPage } from '@/app/(features)/surah/hooks/useDedupedFetchMushafPage';
import { useMushafPagesLookup } from '@/app/(features)/surah/hooks/useMushafPagesLookup';
import { renderWithProvidersAsync, screen } from '@/app/testUtils/renderWithProviders';
import * as api from '@/lib/api';

jest.mock('@/app/(features)/surah/hooks/useMushafPagesLookup', () => ({
  useMushafPagesLookup: jest.fn(),
}));

jest.mock('@/app/(features)/surah/hooks/useDedupedFetchMushafPage', () => ({
  useDedupedFetchMushafPage: jest.fn(),
}));

jest.mock('@/lib/api', () => ({
  ...jest.requireActual('@/lib/api'),
  getChapters: jest.fn(),
}));

const baseProps = {
  mushafName: 'King Fahad Complex V1',
  mushafId: 'qcf-madani-v1',
  resourceId: '1',
  resourceKind: 'surah' as const,
  initialPageNumber: 1,
  chapterId: 1,
  endLabelKey: 'end_of_surah' as const,
};

describe('MushafMain', () => {
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue({ ok: true, text: () => Promise.resolve('<svg></svg>') } as Response);

    (useMushafPagesLookup as jest.Mock).mockReturnValue({
      data: {
        totalPage: 1,
        lookupRange: { from: '1:1', to: '1:7' },
        pages: {
          1: {
            from: '1:1',
            to: '1:7',
            firstVerseKey: '1:1',
            lastVerseKey: '1:7',
          },
        },
      },
      isLoading: false,
      error: null,
    });

    (useDedupedFetchMushafPage as jest.Mock).mockReturnValue({
      page: { pageNumber: 1, lines: [] },
      isLoading: false,
      error: null,
    });
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('displays loading indicator', async () => {
    (useMushafPagesLookup as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    await renderWithProvidersAsync(<MushafMain {...baseProps} />);

    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
  });

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

    expect(screen.getByText('مدنية')).toBeInTheDocument();
    expect(screen.getByText('﷽')).toBeInTheDocument();
  });

  it('omits bismillah for At-Tawbah (surah 9)', async () => {
    await renderWithProvidersAsync(<MushafMain {...baseProps} chapterId={9} />);

    expect(screen.queryByText('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ')).not.toBeInTheDocument();
  });
});
