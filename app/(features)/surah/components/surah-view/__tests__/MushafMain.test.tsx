'use client';

import React from 'react';

import { renderWithProviders, screen } from '@/app/testUtils/renderWithProviders';

import { MushafMain } from '../MushafMain';

import type { Verse } from '@/types';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const createVerse = ({
  id,
  verse_key,
  text_uthmani,
  page_number,
}: {
  id: number;
  verse_key: string;
  text_uthmani: string;
  page_number: number;
}): Verse => ({
  id,
  verse_key,
  text_uthmani,
  verse_number: Number(verse_key.split(':')[1]),
  page_number,
  words: [],
  translations: [],
});

const baseProps = {
  mushafName: 'Unicode - Uthmani 15-line',
  verses: [
    createVerse({ id: 1, verse_key: '1:1', text_uthmani: 'ayah one', page_number: 1 }),
    createVerse({ id: 2, verse_key: '1:2', text_uthmani: 'ayah two', page_number: 1 }),
    createVerse({ id: 3, verse_key: '1:3', text_uthmani: 'ayah three', page_number: 2 }),
  ],
  isLoading: false,
  error: null as string | null,
  loadMoreRef: { current: null } as React.RefObject<HTMLDivElement>,
  isValidating: false,
  isReachingEnd: false,
};

describe('MushafMain', () => {
  it('groups verses by page and renders page headers', () => {
    renderWithProviders(<MushafMain {...baseProps} />);

    expect(screen.getByText('Page 1')).toBeInTheDocument();
    expect(screen.getByText('Page 2')).toBeInTheDocument();
    expect(screen.getByText('1:1 - 1:2')).toBeInTheDocument();
    expect(screen.getByText('1:3')).toBeInTheDocument();
  });

  it('shows verse markers for each ayah', () => {
    renderWithProviders(<MushafMain {...baseProps} />);

    expect(screen.getByLabelText('Ayah 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Ayah 3')).toBeInTheDocument();
  });

  it('renders loader when waiting for initial verses', () => {
    renderWithProviders(<MushafMain {...baseProps} verses={[]} isLoading />);

    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });
});
