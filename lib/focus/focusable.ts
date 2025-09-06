export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(',');

  return Array.from(container.querySelectorAll(selectors)).filter((element) => {
    const el = element as HTMLElement;
    const style = window.getComputedStyle(el);
    return (
      el.offsetWidth > 0 &&
      el.offsetHeight > 0 &&
      !el.hidden &&
      style.visibility !== 'hidden' &&
      style.display !== 'none'
    );
  }) as HTMLElement[];
};
