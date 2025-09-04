'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchVerses } from '@/lib/api';
import { Verse as VerseType } from '@/types';
import { VerseCard } from '@/app/(features)/surah/components';
import { logger } from '@/src/infrastructure/monitoring/Logger';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const [verses, setVerses] = useState<VerseType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setVerses([]);
      return;
    }
    setLoading(true);
    searchVerses(query)
      .then(setVerses)
      .catch((err) => {
        logger.error(err as Error);
        setError('Failed to load results.');
      })
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {query && <h1 className="text-2xl font-bold mb-6">Search results for: {query}</h1>}
      {loading && <p className="text-accent">Loading...</p>}
      {error && <p className="text-status-error mb-4">{error}</p>}
      {!loading && verses.length === 0 && !error && query && (
        <p className="text-muted">No verses found.</p>
      )}
      <div className="space-y-8">
        {verses.map((v) => (
          <VerseCard key={v.id} verse={v} />
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-6 max-w-4xl mx-auto">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
