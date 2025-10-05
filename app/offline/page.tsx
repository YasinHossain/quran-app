import { Metadata } from 'next';

import { OfflineActions } from './OfflineActions';

export const metadata: Metadata = {
  title: 'Offline - Quran App',
  description: 'You are currently offline. Some features may be limited.',
};

const OFFLINE_FEATURES = [
  'Previously viewed suras and verses',
  'Cached audio recitations',
  'Your bookmarks and reading progress',
  'Settings and preferences',
] as const;

function OfflineIllustration(): React.JSX.Element {
  return (
    <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-accent/15 text-accent">
      <svg
        className="h-12 w-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
        />
      </svg>
    </div>
  );
}

function FeatureCheckIcon(): React.JSX.Element {
  return (
    <svg className="mr-3 h-4 w-4 flex-shrink-0 text-accent" fill="currentColor" viewBox="0 0 20 20">
      <path
        clipRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        fillRule="evenodd"
      />
    </svg>
  );
}

function FeatureList(): React.JSX.Element {
  return (
    <section className="mb-8 w-full rounded-lg border border-border bg-surface p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Available Offline</h2>
      <ul className="space-y-3 text-left text-sm text-muted">
        {OFFLINE_FEATURES.map((feature) => (
          <li key={feature} className="flex items-center">
            <FeatureCheckIcon />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function OfflinePage(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-16">
        <article className="mx-auto flex max-w-md flex-col items-center text-center">
          <OfflineIllustration />
          <header className="mb-8">
            <h1 className="mb-4 text-3xl font-bold text-foreground">You&apos;re Offline</h1>
            <p className="text-muted leading-relaxed">
              Don&apos;t worry! You can still access previously viewed suras and play cached audio
              recitations. Your reading progress and bookmarks are saved locally.
            </p>
          </header>
          <FeatureList />
          <OfflineActions />
          <p className="mt-8 text-sm text-content-muted">
            Connection will be restored automatically when you&apos;re back online.
          </p>
        </article>
      </section>
    </main>
  );
}
