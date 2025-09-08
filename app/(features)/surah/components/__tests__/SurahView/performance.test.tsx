import './test-utils';
import { SurahView } from '@/app/(features)/surah/components/SurahView.client';
import { createPerformanceTestSuite } from '@/app/testUtils/performanceTestUtils';

createPerformanceTestSuite('SurahView', SurahView, { surahId: '1' });
