import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { getSurahList } from '@/lib/api';
import type { MockProps } from '@/tests/mocks';

// Mock the API call
jest.mock('@/lib/api', () => ({
  getSurahList: jest.fn(),
}));

jest.mock('next/link', () =>
  ({ href, children }: MockProps<{ href: string }>) => <a href={href}>{children}</a>
);

const mockedGetSurahList = getSurahList as jest.MockedFunction<typeof getSurahList>;

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
});

// Create a test component that mirrors the server component behavior
const TestSurahIndexPage = () => {
  const [surahs, setSurahs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getSurahList().then((data) => {
      setSurahs(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Surah</h1>
      <ul className="space-y-2">
        {surahs.map((s: any) => (
          <li key={s.number}>
            <a href={`/surah/${s.number}`}>{s.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

test('renders list of surah links', async () => {
  mockedGetSurahList.mockResolvedValue([
    {
      number: 1,
      name: 'Al-Fatihah',
      arabicName: 'الفاتحة',
      verses: 7,
      meaning: 'The Opening',
    },
  ]);

  render(<TestSurahIndexPage />);

  await waitFor(() => {
    const link = screen.getByText('Al-Fatihah').closest('a');
    expect(link).toHaveAttribute('href', '/surah/1');
  });
});
