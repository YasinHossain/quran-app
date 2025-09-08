'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { VerseCard } from '@/app/(features)/surah/components';

import { useVerseSearch } from './hooks/useVerseSearch';

function SearchContent(): React.JSX.Element {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const { verses, loading, error } = useVerseSearch(query);

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

export default function SearchPage(): React.JSX.Element {
  return (
    <Suspense fallback={<div className="p-6 max-w-4xl mx-auto">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
