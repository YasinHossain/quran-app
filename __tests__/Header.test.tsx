import { render, screen } from '@testing-library/react'
import Header from '@/app/components/common/Header'

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Returns the key itself for testing purposes
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe('Header', () => {
  it('renders the title', () => {
    render(<Header />);
    // The component uses t('title'), so we expect 'title' to be in the document.
    expect(screen.getByText('title')).toBeInTheDocument();
  });

  it('renders the search placeholder', () => {
    render(<Header />);
    // The component uses t('search_placeholder'), so we check for that key.
    expect(screen.getByPlaceholderText('search_placeholder')).toBeInTheDocument();
  });
});
