import fs from 'fs';
import path from 'path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import type { Page } from '@playwright/test';

const THRESHOLD = 0.01; // 1% mismatch allowed

export async function compareScreenshot(
  page: Page,
  route: string,
  name: string,
  theme: 'light' | 'dark'
) {
  await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
  await page.goto(route);
  await page.waitForLoadState('networkidle');
  const screenshot = await page.screenshot({ fullPage: true });
  const dir = path.join(__dirname, '__screenshots__');
  const file = path.join(dir, `${name}-${theme}.txt`);
  if (!fs.existsSync(file)) {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, screenshot.toString('base64'), 'utf8');
    return;
  }
  const baseline = Buffer.from(fs.readFileSync(file, 'utf8'), 'base64');
  const imgBaseline = PNG.sync.read(baseline);
  const imgCurrent = PNG.sync.read(screenshot);
  if (imgBaseline.width !== imgCurrent.width || imgBaseline.height !== imgCurrent.height) {
    throw new Error('Screenshot size mismatch');
  }
  const diff = new PNG({ width: imgBaseline.width, height: imgBaseline.height });
  const mismatched = pixelmatch(
    imgBaseline.data,
    imgCurrent.data,
    diff.data,
    imgBaseline.width,
    imgBaseline.height,
    { threshold: 0.1 }
  );
  const ratio = mismatched / (imgBaseline.width * imgBaseline.height);
  if (ratio > THRESHOLD) {
    throw new Error(`Screenshot mismatch ratio ${ratio}`);
  }
}
