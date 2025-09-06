import { createMockPage, MockPage } from './utils';

describe('Responsive Design', () => {
  let page: MockPage;

  beforeEach(() => {
    page = createMockPage();
  });

  it('should work on mobile devices', async () => {
    await page.goto('http://localhost:3000/surah/1');

    const mobileMenu = await page.locator('[data-testid="mobile-menu-trigger"]').isVisible();
    expect(mobileMenu).toBe(true);

    await page.click('[data-testid="mobile-menu-trigger"]');

    const menuItems = await page.locator('[data-testid="mobile-menu"] .menu-item').count();
    expect(menuItems).toBeGreaterThan(0);
  });

  it('should adapt audio player for mobile', async () => {
    await page.goto('http://localhost:3000/surah/1');
    await page.click('[data-testid="play-surah-button"]');

    const mobileAudioControls = await page
      .locator('[data-testid="mobile-audio-controls"]')
      .isVisible();
    expect(mobileAudioControls).toBe(true);

    const playPauseButton = await page.locator('[data-testid="mobile-play-pause"]').isVisible();
    expect(playPauseButton).toBe(true);
  });
});
