import { renderWithProviders, screen } from '@/app/testUtils/renderWithProviders';
import userEvent from '@testing-library/user-event';
import TafsirTabs from '@/app/(features)/tafsir/[surahId]/[ayahId]/components/TafsirTabs';
import { getTafsirCached } from '@/lib/tafsir/tafsirCache';
import useSWR from 'swr';

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

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
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
