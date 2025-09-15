import { PerformanceTester } from '@/app/testUtils/performance/tester';
import { SurahView } from '../../SurahView.client';

describe('SurahView Performance', () => {
  it('renders twice when props remain the same', () => {
    const tester = new PerformanceTester(SurahView);
    tester.render({ surahId: '1' }).rerender({ surahId: '1' }).expectRenderCount(2);
  });
});
