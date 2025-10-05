import { createMockPage, MockPage } from './utils';

describe('Audio Functionality', () => {
  let page: MockPage;

  beforeEach(() => {
    page = createMockPage();
  });

  it('should play verse audio', async () => {
    await page.goto('http://localhost:3000/surah/1');
    await page.click('[data-testid="play-button-1-1"]');

    const audioPlayer = await page.locator('[data-testid="audio-player"]').isVisible();
    expect(audioPlayer).toBe(true);

    const pauseButton = await page.locator('[data-testid="pause-button-1-1"]').isVisible();
    expect(pauseButton).toBe(true);
  });

  it('should play continuous surah audio', async () => {
    await page.goto('http://localhost:3000/surah/1');
    await page.click('[data-testid="play-surah-button"]');

    const audioPlayer = await page.locator('[data-testid="audio-player"]').isVisible();
    expect(audioPlayer).toBe(true);

    const currentVerse = await page.locator('[data-testid="verse-1-1"].playing').isVisible();
    expect(currentVerse).toBe(true);
  });

  it('should control audio playback', async () => {
    await page.goto('http://localhost:3000/surah/1');
    await page.click('[data-testid="play-surah-button"]');
    await page.click('[data-testid="audio-pause-button"]');

    const playButton = await page.locator('[data-testid="audio-play-button"]').isVisible();
    expect(playButton).toBe(true);

    await page.click('[data-testid="audio-next-button"]');

    const nextVerse = await page.locator('[data-testid="verse-1-2"].playing').isVisible();
    expect(nextVerse).toBe(true);
  });
});
