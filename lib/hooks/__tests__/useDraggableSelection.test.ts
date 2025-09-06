import { act, renderHook } from '@testing-library/react';

import { useDraggableSelection } from '@/lib/hooks/useDraggableSelection';

describe('useDraggableSelection', () => {
  it('reorders selection via drag and drop', () => {
    const { result } = renderHook(() => useDraggableSelection([1, 2, 3]));

    const dragStartEvent = {
      dataTransfer: { effectAllowed: '' },
    } as unknown as React.DragEvent<HTMLDivElement>;
    act(() => result.current.handleDragStart(dragStartEvent, 1));

    const dropEvent = { preventDefault: () => {} } as unknown as React.DragEvent<HTMLDivElement>;
    act(() => result.current.handleDrop(dropEvent, 3));

    expect(result.current.orderedSelection).toEqual([2, 3, 1]);
  });
});
