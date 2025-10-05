/**
 * Accessibility testing utilities
 */
export const testAccessibility = {
  testFocusManagement: async (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const tabOrder: HTMLElement[] = [];
    for (let i = 0; i < focusableElements.length; i++) {
      const element = focusableElements[i] as HTMLElement;
      element.focus();
      tabOrder.push(document.activeElement as HTMLElement);
    }

    return {
      focusableCount: focusableElements.length,
      tabOrder,
      hasLogicalOrder: tabOrder.every((el, i) => el === focusableElements[i]),
    };
  },

  testTouchTargets: (container: HTMLElement) => {
    const interactiveElements = container.querySelectorAll(
      'button, a, input[type="button"], input[type="submit"], [role="button"]'
    );

    const undersizedTargets: Array<{ element: Element; size: { width: number; height: number } }> =
      [];

    interactiveElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const minSize = 44;

      if (rect.width < minSize || rect.height < minSize) {
        undersizedTargets.push({
          element,
          size: { width: rect.width, height: rect.height },
        });
      }
    });

    return {
      totalTargets: interactiveElements.length,
      undersizedTargets,
      isCompliant: undersizedTargets.length === 0,
    };
  },

  testReadability: (container: HTMLElement) => {
    const textElements = container.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
    const issues: Array<{ element: Element; issue: string }> = [];

    textElements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      const fontSize = parseFloat(styles.fontSize);
      const lineHeight = parseFloat(styles.lineHeight);

      if (fontSize < 16) {
        issues.push({
          element,
          issue: `Font size ${fontSize}px is below recommended 16px minimum`,
        });
      }

      if (lineHeight && lineHeight / fontSize < 1.4) {
        issues.push({
          element,
          issue: `Line height ratio ${lineHeight / fontSize} is below recommended 1.4`,
        });
      }
    });

    return {
      totalElements: textElements.length,
      issues,
      isReadable: issues.length === 0,
    };
  },
};
