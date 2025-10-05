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

const dragStartEvt = (): React.DragEvent<HTMLDivElement> =>
  ({ dataTransfer: { effectAllowed: '' } }) as unknown as React.DragEvent<HTMLDivElement>;
const dropEvt = (): React.DragEvent<HTMLDivElement> =>
  ({ preventDefault: () => {} }) as unknown as React.DragEvent<HTMLDivElement>;

describe('useSelectableResources - grouping and filtering', () => {
  it('groups by language and filters search results', () => {
    const { result } = renderHook(() =>
      useSelectableResources<Item>({ resources, selectionLimit: 3 })
    );

    expect(result.current.languages).toEqual(['All', 'Arabic', 'English']);
    const groups = result.current.groupedResources;
    expect(groups['English']!.map((r) => r.id)).toEqual([1, 2]);
    expect(groups['Arabic']!.map((r) => r.id)).toEqual([3, 4]);

    act(() => result.current.setSearchTerm('arb'));
    expect(result.current.groupedResources['Arabic']!.map((r) => r.id)).toEqual([3, 4]);
    expect(result.current.groupedResources['English']).toBeUndefined();
  });
});

describe('useSelectableResources - selection and reorder', () => {
  it('enforces selectionLimit and reports toggle status', () => {
    const { result } = renderHook(() =>
      useSelectableResources<Item>({ resources, selectionLimit: 2 })
    );

    let changed = false;
    act(() => {
      changed = result.current.handleSelectionToggle(1);
    });
    expect(changed).toBe(true);
    expect(result.current.selectedIds.has(1)).toBe(true);

    act(() => {
      changed = result.current.handleSelectionToggle(2);
    });
    expect(changed).toBe(true);
    expect(result.current.orderedSelection).toEqual([1, 2]);

    act(() => {
      changed = result.current.handleSelectionToggle(3);
    });
    expect(changed).toBe(false);
    expect(result.current.selectedIds.size).toBe(2);

    act(() => {
      changed = result.current.handleSelectionToggle(1);
    });
    expect(changed).toBe(true);
    expect(result.current.selectedIds.has(1)).toBe(false);

    act(() => {
      changed = result.current.handleSelectionToggle(3);
    });
    expect(changed).toBe(true);
    expect(result.current.orderedSelection).toEqual([2, 3]);
  });

  it('reorders selections via drag and drop', () => {
    const { result } = renderHook(() =>
      useSelectableResources<Item>({ resources, selectionLimit: 3, initialSelectedIds: [1, 2, 3] })
    );

    act(() => result.current.handleDragStart(dragStartEvt(), 1));
    act(() => result.current.handleDrop(dropEvt(), 3));
    expect(result.current.orderedSelection).toEqual([2, 3, 1]);
  });
});
