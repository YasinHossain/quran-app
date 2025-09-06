import { setupMobilePerformanceTest, testPerformance } from './test-utils';

describe('Layout Shift Performance', () => {
  let cleanup: () => void;

  beforeEach(() => {
    ({ cleanup } = setupMobilePerformanceTest());
  });

  afterEach(() => {
    cleanup();
  });

  it('should minimize layout shift during breakpoint transitions', async () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div style="width: 100px; height: 100px;">Item 1</div>
      <div style="width: 100px; height: 100px;">Item 2</div>
      <div style="width: 100px; height: 100px;">Item 3</div>
    `;
    document.body.appendChild(container);

    const result = await testPerformance.measureLayoutShift(container, ['iPhone SE', 'iPad']);

    expect(result.isStable).toBe(true);
    expect(result.averageShift).toBeLessThan(50);

    document.body.removeChild(container);
  });

  it('should handle orientation changes smoothly', async () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div style="width: 50vw; height: 100px;">Responsive Item</div>
    `;
    document.body.appendChild(container);

    const result = await testPerformance.measureLayoutShift(container, [
      'iPhone 12 Pro',
      'iPhone 12 Pro Landscape',
    ]);

    expect(result.isStable).toBe(true);

    document.body.removeChild(container);
  });
});
