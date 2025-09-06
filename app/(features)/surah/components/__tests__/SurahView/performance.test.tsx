import './test-utils';
import { createPerformanceTestSuite } from '@/app/testUtils/performanceTestUtils';
import { SurahView } from '../../SurahView.client';

createPerformanceTestSuite('SurahView', SurahView, { surahId: '1' });
