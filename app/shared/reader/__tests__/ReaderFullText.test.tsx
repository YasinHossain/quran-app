import React from 'react';
import { renderToString } from 'react-dom/server';

import { ReaderFullText, buildFullTextTitle } from '@/app/shared/reader/ReaderFullText';

import type { PrerenderedVerse } from '@/types';

const TOTAL = 286;
const verses: PrerenderedVerse[] = Array.from({ length: TOTAL }, (_, i) => ({
  verseKey: `2:${i + 1}`,
  arabic: `arabic-${i + 1}`,
  translations: [
    {
      resourceId: 20,
      html: `translation-${i + 1}`,
      resourceName: 'Saheeh International',
      languageCode: 'en',
    },
  ],
}));

const renderToContainer = (element: React.ReactElement): HTMLElement => {
  const container = document.createElement('div');
  container.innerHTML = renderToString(element);
  return container;
};

describe('ReaderFullText', () => {
  it('server-renders every verse once, in order, with Arabic and translation text', () => {
    const container = renderToContainer(
      <ReaderFullText title={buildFullTextTitle('Surah Al-Baqarah', verses)} verses={verses} />
    );

    const keys = Array.from(container.querySelectorAll('[data-verse-key]')).map((el) =>
      el.getAttribute('data-verse-key')
    );
    expect(keys).toEqual(verses.map((verse) => verse.verseKey));

    const last = container.querySelector('[data-verse-key="2:286"]');
    expect(last?.querySelector('[lang="ar"][dir="rtl"]')?.textContent).toBe('arabic-286');
    expect(last?.querySelector('[lang="en"]')?.textContent).toBe('translation-286');
  });

  it('is a collapsed details section labelled with the subject and translation', () => {
    const container = renderToContainer(
      <ReaderFullText title={buildFullTextTitle('Surah Al-Baqarah', verses)} verses={verses} />
    );

    const details = container.querySelector('details');
    expect(details).not.toBeNull();
    expect(details?.hasAttribute('open')).toBe(false);
    expect(details?.querySelector('summary')?.textContent).toBe(
      'Full text of Surah Al-Baqarah — Arabic and Saheeh International translation'
    );
  });
});

describe('ReaderFullText transliteration', () => {
  it('reads the Latin transliteration left to right inside an RTL page', () => {
    const container = renderToContainer(
      <ReaderFullText
        title="النص الكامل"
        lang="ar"
        dir="rtl"
        verses={[
          { verseKey: '108:2', arabic: 'arabic', translations: [], transliteration: 'latin' },
        ]}
      />
    );

    const line = container.querySelector('[data-verse-key="108:2"] [lang="ar-Latn"]');
    expect(line?.textContent).toBe('latin');
    expect(line?.getAttribute('dir')).toBe('ltr');
  });
});

describe('ReaderFullText verse links', () => {
  const sample = verses.slice(254, 256);

  it('links each verse key to its verse page', () => {
    const container = renderToContainer(<ReaderFullText title="Full text" verses={sample} />);

    const link = container.querySelector('[data-verse-key="2:255"] a');
    expect(link?.textContent).toBe('2:255');
    expect(link?.getAttribute('href')).toBe('/surah/al-baqarah/255');
  });

  it('links to the verse page in the page language', () => {
    const container = renderToContainer(
      <ReaderFullText title="Full text" verses={sample} locale="bn" />
    );

    expect(container.querySelector('[data-verse-key="2:256"] a')?.getAttribute('href')).toBe(
      '/bn/surah/al-baqarah/256'
    );
  });
});
