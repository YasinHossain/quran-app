import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TafsirTabs from '@/app/features/tafsir/[surahId]/[ayahId]/_components/TafsirTabs';
import { getTafsirCached } from '@/lib/tafsirCache';
import useSWR from 'swr';

jest.mock('swr');
jest.mock('@/lib/tafsirCache');

const mockUseSWR = useSWR as jest.Mock;
const mockGetTafsirCached = getTafsirCached as jest.Mock;

const resources = [
  { id: 1, name: 'Tafsir One' },
  { id: 2, name: 'Tafsir Two' },
];

beforeEach(() => {
  mockUseSWR.mockReturnValue({ data: resources });
  mockGetTafsirCached.mockImplementation((key: string, id: number) =>
    Promise.resolve(`Text ${id}`)
  );
});

it('shows tabs and switches content on click', async () => {
  render(<TafsirTabs verseKey="1:1" tafsirIds={[1, 2]} />);
  expect(screen.getByRole('button', { name: 'Tafsir One' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Tafsir Two' })).toBeInTheDocument();

  expect(await screen.findByText('Text 1')).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: 'Tafsir Two' }));
  expect(await screen.findByText('Text 2')).toBeInTheDocument();
  expect(mockGetTafsirCached).toHaveBeenCalledWith('1:1', 2);
});
