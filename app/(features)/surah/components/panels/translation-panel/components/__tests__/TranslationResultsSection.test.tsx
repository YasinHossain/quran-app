import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TranslationResultsSection } from '../TranslationResultsSection';
import { TranslationResource } from '@/types';

// Mock dependencies
jest.mock('@/app/shared/resource-panel', () => ({
  ResourceItem: ({ item, isSelected, onToggle }: any) => (
    <button type="button" data-testid="resource-item" onClick={() => onToggle(item.id)}>
      {item.name} - {isSelected ? 'Selected' : 'Not Selected'}
    </button>
  ),
}));

jest.mock('../TranslationsByLanguage', () => ({
  TranslationsByLanguage: ({ sectionsToRender }: any) => (
    <div data-testid="translations-by-language">
      {sectionsToRender.map((section: any) => (
        <div key={section.language}>
          {section.language}: {section.items.length} items
        </div>
      ))}
    </div>
  ),
}));

describe('TranslationResultsSection', () => {
  const mockTranslations: TranslationResource[] = [
    { id: 1, name: 'Translation 1', lang: 'English' },
    { id: 2, name: 'Translation 2', lang: 'Bengali' },
  ];

  const mockSections = [
    { language: 'English', items: [mockTranslations[0]] },
    { language: 'Bengali', items: [mockTranslations[1]] },
  ];

  const defaultProps = {
    activeFilter: 'All',
    sectionsToRender: mockSections,
    resourcesToRender: mockTranslations,
    selectedIds: new Set<number>([1]),
    onToggle: jest.fn(),
  };

  it('renders TranslationsByLanguage when activeFilter is "All"', () => {
    render(<TranslationResultsSection {...defaultProps} />);
    expect(screen.getByTestId('translations-by-language')).toBeInTheDocument();
    expect(screen.getByText('English: 1 items')).toBeInTheDocument();
  });

  it('renders a list of ResourceItems when activeFilter is a specific language', () => {
    const props = {
      ...defaultProps,
      activeFilter: 'Bengali',
      resourcesToRender: [mockTranslations[1]],
    };

    render(<TranslationResultsSection {...props} />);

    // Should NOT render the grouped view
    expect(screen.queryByTestId('translations-by-language')).not.toBeInTheDocument();

    // Should render the individual items
    const items = screen.getAllByTestId('resource-item');
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent('Translation 2');
  });

  it('renders empty state when no resources are found', () => {
    const props = {
      ...defaultProps,
      resourcesToRender: [],
    };

    render(<TranslationResultsSection {...props} />);
    expect(
      screen.getByText('No translation resources found for the selected filter.')
    ).toBeInTheDocument();
  });

  it('calls onToggle when an item is clicked in single language view', () => {
    const props = {
      ...defaultProps,
      activeFilter: 'Bengali',
      resourcesToRender: [mockTranslations[1]],
    };

    render(<TranslationResultsSection {...props} />);

    const item = screen.getByTestId('resource-item');
    fireEvent.click(item);

    expect(props.onToggle).toHaveBeenCalledWith(2);
  });
});
