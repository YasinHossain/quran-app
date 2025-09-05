'use client';

import { memo } from 'react';

import { GlassCard, NumberBadge } from '@/app/shared/ui';

import type { Surah } from '@/types';

interface SurahCardProps {
  surah: Surah;
}

/**
 * Individual surah card component with responsive design
 * Displays surah number, name, meaning, and verse count
 */
export const SurahCard = memo(function SurahCard({ surah }: SurahCardProps) {
  return (
    <GlassCard
      href={`/surah/${surah.number}`}
      key={surah.number}
      variant="surface"
      size="comfortable"
      radius="xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <NumberBadge number={surah.number} />
          <div>
            <h3 className="font-semibold text-lg text-content-primary">{surah.name}</h3>
            <p className="text-sm text-content-secondary">{surah.meaning}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-amiri text-2xl text-content-primary group-hover:text-accent transition-colors">
            {surah.arabicName}
          </p>
          <p className="text-sm text-content-secondary">{surah.verses} Verses</p>
        </div>
      </div>
    </GlassCard>
  );
});
