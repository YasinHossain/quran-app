import { getFocusableElements, focusVisibleClasses, getFocusVisibleClasses } from '@/lib/focus';

import { setupDom } from './focus/test-utils';

describe('focus utilities', () => {
  let container: HTMLElement;
  let cleanup: () => void;

  beforeEach(() => {
    ({ container, cleanup } = setupDom());
  });

  afterEach(() => {
    cleanup();
  });

  describe('getFocusableElements', () => {
    it('finds all focusable elements in order', () => {
      const focusable = getFocusableElements(container);
      expect(focusable).toHaveLength(5);
      expect(focusable.map((el) => el.id)).toEqual(['btn1', 'input1', 'link1', 'btn2', 'select1']);
    });

    it('excludes disabled elements', () => {
      const disabledButton = container.querySelector('#btn1') as HTMLButtonElement;
      disabledButton.disabled = true;
      const focusable = getFocusableElements(container);
      expect(focusable).toHaveLength(4);
      expect(focusable.map((el) => el.id)).not.toContain('btn1');
    });

    it('excludes hidden elements', () => {
      const hiddenInput = container.querySelector('#input1') as HTMLInputElement;
      hiddenInput.style.display = 'none';
      const focusable = getFocusableElements(container);
      expect(focusable).toHaveLength(4);
      expect(focusable.map((el) => el.id)).not.toContain('input1');
    });

    it('excludes elements with visibility hidden', () => {
      const hiddenLink = container.querySelector('#link1') as HTMLAnchorElement;
      hiddenLink.style.visibility = 'hidden';
      const focusable = getFocusableElements(container);
      expect(focusable).toHaveLength(4);
      expect(focusable.map((el) => el.id)).not.toContain('link1');
    });
  });

  describe('focus visible utilities', () => {
    it('returns base classes by default', () => {
      expect(getFocusVisibleClasses()).toBe(focusVisibleClasses.base);
    });

    it('returns specified variant classes', () => {
      expect(getFocusVisibleClasses('button')).toBe(focusVisibleClasses.button);
    });
  });
});
