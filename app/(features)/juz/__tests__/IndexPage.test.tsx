import JuzIndexPage from '@/app/(features)/juz/page';
import { setMatchMedia } from '@/app/testUtils/matchMedia';
import { renderWithProvidersAsync, screen } from '@/app/testUtils/renderWithProviders';

import type { MockProps } from '@/tests/mocks';

let mockUiLanguage = 'en';

jest.mock('next/headers', () => ({
  headers: async () => new Headers({ 'x-ui-language': mockUiLanguage }),
}));
jest.mock('next/link', () => ({ href, children }: MockProps<{ href: string }>) => (
  <a href={href}>{children}</a>
));

beforeAll(() => {
  setMatchMedia(false);
});

const renderPage = async (): Promise<void> => {
  await renderWithProvidersAsync(await JuzIndexPage());
};

test('renders list of juz links', async () => {
  await renderPage();
  const link = screen.getByText('Juz 1').closest('a');
  expect(link).toHaveAttribute('href', '/juz/1');
});

test('links to the localized juz pages', async () => {
  mockUiLanguage = 'bn';
  await renderPage();
  const link = screen.getByText('পারা 1').closest('a');
  expect(link).toHaveAttribute('href', '/bn/juz/1');
  mockUiLanguage = 'en';
});
