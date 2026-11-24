import AboutPage from '@/app/[lang]/(features)/about/page';
import { renderWithProvidersAsync, screen } from '@/app/testUtils/renderWithProviders';

import type { MockProps } from '@/tests/mocks';

let mockUiLanguage = 'en';

jest.mock('next/link', () => ({ href, children }: MockProps<{ href: string }>) => (
  <a href={href}>{children}</a>
));

const mockTranslations = jest.fn();
const mockTafsirs = jest.fn();
const mockReciters = jest.fn();

jest.mock('@/lib/api/server/resources', () => ({
  getTranslationResourcesServer: () => mockTranslations(),
  getReciterResourcesServer: (language: string) => mockReciters(language),
}));
jest.mock('@/lib/api/server/tafsir', () => ({
  getTafsirResourcesServer: () => mockTafsirs(),
}));

const renderPage = async (): Promise<void> => {
  await renderWithProvidersAsync(
    await AboutPage({ params: Promise.resolve({ lang: mockUiLanguage }) })
  );
};

beforeEach(() => {
  mockUiLanguage = 'en';
  mockTranslations.mockResolvedValue([
    { id: 20, name: 'Saheeh International', lang: 'english' },
    { id: 161, name: 'Taisirul Quran', lang: 'bengali' },
    { id: 57, name: 'Transliteration', lang: 'english' },
  ]);
  mockTafsirs.mockResolvedValue([{ id: 169, name: 'Ibn Kathir (Abridged)', lang: 'english' }]);
  mockReciters.mockResolvedValue([{ id: 7, name: 'Mishari Alafasy', style: 'Murattal' }]);
});

test('lists translations, tafsirs and reciters from the API, grouped by language', async () => {
  await renderPage();

  const english = screen.getAllByRole('heading', { name: 'English' })[0];
  expect(english?.nextElementSibling).toHaveTextContent('Saheeh International');
  expect(screen.getByRole('heading', { name: 'Bengali' }).nextElementSibling).toHaveTextContent(
    'Taisirul Quran'
  );
  expect(screen.getByText('Ibn Kathir (Abridged)')).toBeInTheDocument();
  expect(screen.getByText('Mishari Alafasy (Murattal)')).toBeInTheDocument();
  // Resource 57 is credited under its own heading, not listed as a translator.
  expect(screen.queryByText('Transliteration', { selector: 'li' })).not.toBeInTheDocument();
});

test('requests reciters in the page language', async () => {
  mockUiLanguage = 'bn';
  await renderPage();
  expect(mockReciters).toHaveBeenCalledWith('bn');
});

test('fails instead of rendering a page with a missing source list (not cached by ISR)', async () => {
  mockTranslations.mockRejectedValue(new Error('upstream down'));
  await expect(renderPage()).rejects.toThrow('upstream down');
});

test('emits AboutPage JSON-LD with the localized canonical URL', async () => {
  mockUiLanguage = 'bn';
  const { container } = await renderWithProvidersAsync(
    await AboutPage({ params: Promise.resolve({ lang: mockUiLanguage }) })
  );
  const script = container.querySelector('script[type="application/ld+json"]');
  const data = JSON.parse(script?.textContent ?? '{}') as Record<string, unknown>;

  expect(data['@type']).toBe('AboutPage');
  expect(data['url']).toBe('http://localhost:3000/bn/about');
  expect(data['inLanguage']).toBe('bn');
});
