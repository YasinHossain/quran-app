import { renderWithProviders, screen } from '@/app/testUtils/renderWithProviders';
import TafsirIndexPage from '@/app/(features)/tafsir/page';

jest.mock('next/link', () => ({ href, children }: any) => <a href={href}>{children}</a>);
jest.mock('@/lib/api', () => ({
  getSurahList: jest.fn().mockResolvedValue([
    {
      number: 1,
      name: 'Al-Fatihah',
      arabicName: 'الفاتحة',
      verses: 7,
      meaning: 'The Opening',
    },
  ]),
}));

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

const renderPage = () => renderWithProviders(<TafsirIndexPage />);

test.skip('renders list of tafsir links', async () => {
  await renderPage();
  const link = screen.getByText('Al-Fatihah').closest('a');
  expect(link).toHaveAttribute('href', '/tafsir/1');
});
