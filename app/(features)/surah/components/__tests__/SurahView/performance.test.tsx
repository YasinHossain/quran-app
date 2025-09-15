import { SurahView } from '@/app/(features)/surah/components/SurahView.client';
import { PerformanceTester } from '@/app/testUtils/performance/tester';

describe('SurahView Performance', () => {
  it('renders twice when props remain the same', () => {
    const tester = new PerformanceTester(SurahView);
    tester.render({ surahId: '1' }).rerender({ surahId: '1' }).expectRenderCount(2);
  });
});
