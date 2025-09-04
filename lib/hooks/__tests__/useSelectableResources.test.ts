import { renderHook, act } from '@testing-library/react';
import { useSelectableResources } from '@/lib/hooks/useSelectableResources';

interface Item {
  id: number;
  name: string;
  lang: string;
}

const resources: Item[] = [
  { id: 1, name: 'Eng A', lang: 'English' },
  { id: 2, name: 'Eng B', lang: 'English' },
  { id: 3, name: 'Arb A', lang: 'Arabic' },
  { id: 4, name: 'Arb B', lang: 'Arabic' },
];

describe('useSelectableResources', () => {
  it('respects selection limits and supports reordering', () => {
    const { result } = renderHook(() =>
      useSelectableResources<Item>({ resources, selectionLimit: 2 })
    );

    act(() => result.current.handleSelectionToggle(1));
    act(() => result.current.handleSelectionToggle(2));
    expect(result.current.orderedSelection).toEqual([1, 2]);

    let added = false;
    act(() => {
      added = result.current.handleSelectionToggle(3);
    });
    expect(added).toBe(false);
    expect(result.current.selectedIds.size).toBe(2);

    act(() => result.current.handleSelectionToggle(1));
    expect(result.current.selectedIds.has(1)).toBe(false);

    act(() => {
      added = result.current.handleSelectionToggle(3);
    });
    expect(added).toBe(true);
    expect(result.current.orderedSelection).toEqual([2, 3]);

    act(() => result.current.handleDragStart({ dataTransfer: { effectAllowed: '' } } as any, 2));
    act(() => result.current.handleDrop({ preventDefault: () => {} } as any, 3));
    expect(result.current.orderedSelection).toEqual([3, 2]);
  });

  it('filters by search term and active language', () => {
    const { result } = renderHook(() =>
      useSelectableResources<Item>({ resources, selectionLimit: 2 })
    );

    expect(result.current.languages).toEqual(['All', 'Arabic', 'English']);

    act(() => result.current.setSearchTerm('arb'));
    expect(Object.keys(result.current.groupedResources)).toEqual(['Arabic']);

    act(() => result.current.setSearchTerm(''));
    act(() => result.current.setActiveFilter('Arabic'));
    const activeArabic = result.current.groupedResources[result.current.activeFilter];
    expect(activeArabic?.map((r) => r.id)).toEqual([3, 4]);

    act(() => result.current.setActiveFilter('English'));
    const activeEnglish = result.current.groupedResources[result.current.activeFilter];
    expect(activeEnglish?.map((r) => r.id)).toEqual([1, 2]);
  });
});
