import { renderHook, act } from '@testing-library/react';
import useSelectableResources from '@/lib/hooks/useSelectableResources';

interface Item {
  id: number;
  name: string;
  lang: string;
}

const resources: Item[] = [
  { id: 1, name: 'Eng A', lang: 'English' },
  { id: 2, name: 'Eng B', lang: 'English' },
  { id: 3, name: 'Arb A', lang: 'Arabic' },
];

describe('useSelectableResources', () => {
  it('handles search and grouping', () => {
    const { result } = renderHook(() =>
      useSelectableResources<Item>({ resources, selectionLimit: 2 })
    );
    expect(result.current.languages).toEqual(['All', 'Arabic', 'English']);
    act(() => result.current.setSearchTerm('arb'));
    expect(result.current.groupedResources['Arabic']).toHaveLength(1);
    expect(result.current.groupedResources['English']).toBeUndefined();
  });

  it('enforces selection limit and supports ordering', () => {
    const { result } = renderHook(() =>
      useSelectableResources<Item>({ resources, selectionLimit: 2 })
    );
    act(() => result.current.handleSelectionToggle(1));
    act(() => result.current.handleSelectionToggle(2));
    let added = false;
    act(() => {
      added = result.current.handleSelectionToggle(3);
    });
    expect(added).toBe(false);
    expect(result.current.selectedIds.size).toBe(2);
    act(() => result.current.handleDragStart({ dataTransfer: { effectAllowed: '' } } as any, 1));
    act(() => result.current.handleDrop({ preventDefault: () => {} } as any, 2));
    expect(result.current.orderedSelection).toEqual([2, 1]);
  });
});
