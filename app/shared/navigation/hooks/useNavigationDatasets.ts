import { useMemo } from 'react';

import { getAllJuzs, getAllPages } from '@/app/shared/navigation/datasets';

import type { JuzSummary } from '@/app/shared/navigation/types';

interface NavigationDatasets {
  juzs: ReadonlyArray<JuzSummary>;
  pages: ReadonlyArray<number>;
}

export function useNavigationDatasets(): NavigationDatasets {
  const juzs = useMemo(() => getAllJuzs(), []);
  const pages = useMemo(() => getAllPages(), []);

  return { juzs, pages };
}
