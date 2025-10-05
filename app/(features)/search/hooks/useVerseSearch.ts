import { useEffect, useState } from 'react';

import { searchVerses } from '@/lib/api';
import { logger } from '@/src/infrastructure/monitoring/Logger';

import type { Verse as VerseType } from '@/types';

export function useVerseSearch(query: string): {
  readonly verses: VerseType[];
  readonly loading: boolean;
  readonly error: string | null;
} {
  const [verses, setVerses] = useState<VerseType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setVerses([]);
      setLoading(false);
      setError(null);
      return;
    }

    let isActive = true;

    setLoading(true);
    setError(null);

    searchVerses(query)
      .then((results) => {
        if (!isActive) {
          return;
        }
        setVerses(results);
      })
      .catch((err) => {
        if (!isActive) {
          return;
        }
        logger.error(err as Error);
        setError('Failed to load results.');
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [query]);

  return { verses, loading, error } as const;
}
