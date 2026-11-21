import React from 'react';
import { renderToString } from 'react-dom/server';

import { SurahCalligraphyIntro } from '@/app/(features)/surah/components/surah-view/SurahCalligraphyIntro';
import { ReaderServerDataProvider } from '@/app/shared/reader/ReaderServerData';
import {
  renderWithProvidersAsync,
  screen,
  TestProviders,
} from '@/app/testUtils/renderWithProviders';

import type { ReaderChapterSummary } from '@/app/shared/reader/ReaderServerData';

const FATIHAH: ReaderChapterSummary = {
  id: 1,
  name_simple: 'Al-Fatihah',
  verses_count: 7,
  revelation_place: 'makkah',
};

const BAQARAH: ReaderChapterSummary = {
  id: 2,
  name_simple: 'Al-Baqarah',
  verses_count: 286,
  revelation_place: 'madinah',
};

describe('SurahCalligraphyIntro', () => {
  it('server-renders the verse count and Meccan label from chapter data', () => {
    // The client chapter list is empty during SSR; the header must come from server chapter data.
    const html = renderToString(
      <TestProviders>
        <ReaderServerDataProvider chapter={FATIHAH}>
          <SurahCalligraphyIntro chapterId={1} />
        </ReaderServerDataProvider>
      </TestProviders>
    );

    expect(html).toMatch(/7(<!-- -->)?\s*verses/);
    expect(html).toContain('مكية');
    expect(html).not.toContain('مدنية');
    // Crawlable link to the surah's overview page.
    expect(html).toContain('href="/surah/al-fatihah/about"');
  });

  it('labels a Medinan surah as Medinan with its verse count', async () => {
    await renderWithProvidersAsync(
      <ReaderServerDataProvider chapter={BAQARAH}>
        <SurahCalligraphyIntro chapterId={2} />
      </ReaderServerDataProvider>
    );

    expect(screen.getByText(/286\s*verses/)).toBeInTheDocument();
    expect(screen.getByText('مدنية')).toBeInTheDocument();
    expect(screen.queryByText('مكية')).not.toBeInTheDocument();
  });

  it('omits count and revelation place instead of guessing when chapter data is missing', async () => {
    await renderWithProvidersAsync(
      <ReaderServerDataProvider chapter={FATIHAH}>
        <SurahCalligraphyIntro chapterId={36} />
      </ReaderServerDataProvider>
    );

    expect(screen.queryByText(/0\s*verses/)).not.toBeInTheDocument();
    expect(screen.queryByText('مكية')).not.toBeInTheDocument();
    expect(screen.queryByText('مدنية')).not.toBeInTheDocument();
  });
});
