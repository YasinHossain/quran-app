'use client';
import { GlassCard, NumberBadge } from '@/app/shared/ui';

const allPages = Array.from({ length: 604 }, (_, i) => i + 1);

export default function PageTab() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {allPages.map((page) => (
        <GlassCard href={`/page/${page}`} key={page} variant="surface" size="spacious" radius="xl">
          <div className="flex items-center space-x-4">
            <NumberBadge number={page} />
            <h3 className="font-semibold text-lg text-content-primary">Page {page}</h3>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
