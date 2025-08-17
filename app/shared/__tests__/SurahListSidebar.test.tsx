import React from 'react';
import { renderWithProviders, screen } from '@/app/testUtils/renderWithProviders';
import userEvent from '@testing-library/user-event';
import SurahListSidebar from '@/app/shared/SurahListSidebar';
import useSWR from 'swr';

jest.mock('swr', () => {
  const actual = jest.requireActual('swr');
  return { __esModule: true, ...actual, default: jest.fn() };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  usePathname: jest.fn(),
}));

const mockUseSWR = useSWR as jest.Mock;
const useParams = require('next/navigation').useParams as jest.Mock;
const usePathname = require('next/navigation').usePathname as jest.Mock;

const chapters = [
  {
    id: 1,
    name_simple: 'Al-Fatihah',
    name_arabic: 'الفاتحة',
    revelation_place: 'meccan',
    verses_count: 7,
    pages: [1, 1],
  },
  {
    id: 2,
    name_simple: 'Al-Baqarah',
    name_arabic: 'البقرة',
    revelation_place: 'medinan',
    verses_count: 286,
    pages: [2, 49],
  },
];

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(() => ({
      matches: false,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
  mockUseSWR.mockReturnValue({ data: chapters });
  useParams.mockReturnValue({});
  usePathname.mockReturnValue('/surah');
});

describe('SurahListSidebar', () => {
  it('switches between Surah, Juz, and Page tabs', async () => {
    renderWithProviders(<SurahListSidebar />);

    expect(await screen.findByText('Al-Fatihah')).toBeInTheDocument();

    await userEvent.click(await screen.findByRole('button', { name: 'juz_tab' }));
    expect(await screen.findByText('Juz 1')).toBeInTheDocument();
    expect(screen.queryByText('Al-Fatihah')).not.toBeInTheDocument();

    await userEvent.click(await screen.findByRole('button', { name: 'page_tab' }));
    expect(await screen.findByText('Page 1')).toBeInTheDocument();
    expect(screen.queryByText('Juz 1')).not.toBeInTheDocument();
  });

  it('filters items when searching', async () => {
    renderWithProviders(<SurahListSidebar />);

    const input = await screen.findByPlaceholderText('search_surah');
    await userEvent.type(input, '2');

    expect(await screen.findByText('Al-Baqarah')).toBeInTheDocument();
    expect(screen.queryByText('Al-Fatihah')).not.toBeInTheDocument();
  });

  it('updates selection state when an item is clicked', async () => {
    renderWithProviders(<SurahListSidebar />);

    await userEvent.click(await screen.findByText('Al-Baqarah'));
    const link = (await screen.findByText('Al-Baqarah')).closest('a');
    expect(link).toHaveAttribute('data-active', 'true');
  });
});
