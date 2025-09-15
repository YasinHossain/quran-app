import './test-utils';
import { SurahView } from '../../SurahView.client';
import { createPerformanceTestSuite } from '@/app/testUtils/performanceTestUtils';

createPerformanceTestSuite('SurahView', SurahView, { surahId: '1' });
