import userEvent from '@testing-library/user-event';
import useSWR from 'swr';

import { TafsirTabs } from '@/app/(features)/tafsir/[surahId]/[ayahId]/components/TafsirTabs';
import { setMatchMedia } from '@/app/testUtils/matchMedia';
import { renderWithProviders, screen } from '@/app/testUtils/renderWithProviders';
import { getTafsirCached } from '@/lib/tafsir/tafsirCache';
import { logger } from '@/src/infrastructure/monitoring/Logger';

jest.mock('swr', () => {
  const actual = jest.requireActual('swr');
  return { __esModule: true, ...actual, default: jest.fn() };
});
jest.mock('@/lib/tafsir/tafsirCache');

const mockUseSWR = useSWR as jest.Mock;
const mockGetTafsirCached = getTafsirCached as jest.Mock;

const resources = [
  { id: 1, name: 'Tafsir One' },
  { id: 2, name: 'Tafsir Two' },
];

let errorSpy: jest.SpyInstance;

beforeAll(() => {
  setMatchMedia(false);
});

beforeEach(() => {
  // Ensure a fresh spy each test regardless of global setup/restoreMocks
  errorSpy = jest.spyOn(logger, 'error').mockImplementation(() => {});
});

afterEach(() => {
  errorSpy?.mockRestore();
});

beforeEach(() => {
  mockUseSWR.mockReturnValue({ data: resources });
  mockGetTafsirCached.mockImplementation((key: string, id: number) =>
    Promise.resolve(`Text ${id}`)
  );
});

it('shows tabs and switches content on click', async () => {
  renderWithProviders(<TafsirTabs verseKey="1:1" tafsirIds={[1, 2]} />);
  expect(await screen.findByRole('button', { name: 'Tafsir One' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Tafsir Two' })).toBeInTheDocument();

  expect(await screen.findByText('Text 1')).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: 'Tafsir Two' }));
  expect(await screen.findByText('Text 2')).toBeInTheDocument();
  expect(mockGetTafsirCached).toHaveBeenCalledWith('1:1', 2);
});
