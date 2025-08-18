'use client';
import Link from 'next/link';
import juzData from '@/data/juz.json';

interface JuzSummary {
  number: number;
  name: string;
  surahRange: string;
}

const allJuz: JuzSummary[] = juzData;

export default function JuzTab() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {allJuz.map((juz) => (
        <Link
          href={`/juz/${juz.number}`}
          key={juz.number}
          className="group p-4 sm:p-5 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 content-visibility-auto animate-fade-in-up bg-surface/60"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg transition-colors bg-interactive text-accent group-hover:bg-accent/10">
                {juz.number}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">{juz.name}</h3>
                <p className="text-sm text-muted">{juz.surahRange}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
