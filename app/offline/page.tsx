import { Metadata } from 'next';

import { OfflineActions } from './OfflineActions';

export const metadata: Metadata = {
  title: 'Offline - Quran App',
  description: 'You are currently offline. Please check your internet connection.',
};

function OfflineIllustration(): React.JSX.Element {
  return (
    <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent/5 text-accent shadow-lg shadow-accent/10">
      <svg
        className="h-14 w-14"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3l18 18"
        />
      </svg>
    </div>
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
              It looks like you&apos;ve lost your internet connection. Please check your connection
              and try again.
            </p>
          </header>
          <OfflineActions />
          <p className="mt-8 text-sm text-content-muted">
            Connection will be restored automatically when you&apos;re back online.
          </p>
        </article>
      </section>
    </main>
  );
}
