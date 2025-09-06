import { act, renderHook } from '@testing-library/react';

import { useResourceSearch } from '@/lib/hooks/useResourceSearch';

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

describe('useResourceSearch', () => {
  it('groups by language and filters by search term', () => {
    const { result } = renderHook(() => useResourceSearch<Item>({ resources }));
    expect(result.current.languages).toEqual(['All', 'Arabic', 'English']);

    act(() => result.current.setSearchTerm('arb'));
    expect(result.current.groupedResources.Arabic.map((r) => r.id)).toEqual([3, 4]);
    expect(result.current.groupedResources.English).toBeUndefined();
  });
});
