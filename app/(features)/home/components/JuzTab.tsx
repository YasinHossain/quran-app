'use client';
import { GlassCard, NumberBadge } from '@/app/shared/ui';
import juzData from '@/data/juz.json';

interface JuzSummary {
  number: number;
  name: string;
  surahRange: string;
}

const allJuz: JuzSummary[] = juzData;

export function JuzTab(): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {allJuz.map((juz) => (
        <GlassCard
          href={`/juz/${juz.number}`}
          key={juz.number}
          variant="surface"
          size="spacious"
          radius="xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <NumberBadge number={juz.number} />
              <div>
                <h3 className="font-semibold text-lg text-content-primary">{juz.name}</h3>
                <p className="text-sm text-content-secondary">{juz.surahRange}</p>
              </div>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
