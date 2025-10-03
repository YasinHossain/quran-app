import { SurahView } from '@/app/(features)/surah/components/SurahView.client';
import { PerformanceTester } from '@/app/testUtils/performance/tester';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock(
  '@/app/(features)/surah/components/panels/translation-panel/hooks/useTranslationsData',
  () => {
    const { initialTranslationsData } = jest.requireActual(
      '@/app/(features)/surah/components/panels/translation-panel/translationPanel.data'
    );
    return {
      useTranslationsData: () => ({
        translations: initialTranslationsData,
        loading: false,
        error: null,
        languageSort: (a: string, b: string) => a.localeCompare(b),
      }),
    };
  }
);

describe('SurahView Performance', () => {
  it('renders twice when props remain the same', () => {
    const tester = new PerformanceTester(SurahView);
    tester.render({ surahId: '1' }).rerender({ surahId: '1' }).expectRenderCount(2);
  });
});
