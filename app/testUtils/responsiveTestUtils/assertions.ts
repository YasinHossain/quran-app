import { logger } from '@/src/infrastructure/monitoring/Logger';

/**
 * Assert that element has correct responsive classes
 */
export function assertResponsiveClasses(
  element: HTMLElement,
  expectedClasses: {
    base: string[];
    sm?: string[];
    md?: string[];
    lg?: string[];
    xl?: string[];
  }
): void {
  expectedClasses.base.forEach((className) => {
    expect(element).toHaveClass(className);
  });

  ['sm', 'md', 'lg', 'xl'].forEach((breakpoint) => {
    const classes = expectedClasses[breakpoint as keyof typeof expectedClasses];
    if (classes) {
      classes.forEach((className) => {
        expect(element).toHaveClass(`${breakpoint}:${className}`);
      });
    }
  });
}

/**
 * Touch-friendly interaction assertions
 */
export function assertTouchFriendly(element: HTMLElement): void {
  const styles = window.getComputedStyle(element);
  const minHeight = parseInt(styles.minHeight, 10);
  const minWidth = parseInt(styles.minWidth, 10);

  if (minHeight > 0) {
    expect(minHeight).toBeGreaterThanOrEqual(44);
  }

  if (minWidth > 0) {
    expect(minWidth).toBeGreaterThanOrEqual(44);
  }

  const classList = Array.from(element.classList);
  const hasTouchClass = classList.some(
    (className) =>
      className.includes('min-h-11') ||
      className.includes('min-h-touch') ||
      className.includes('h-11') ||
      className.includes('h-12') ||
      className.includes('p-3') ||
      className.includes('p-4')
  );

  if (!hasTouchClass) {
    logger.warn(`Element may not be touch-friendly: ${element.className}`);
  }
}
