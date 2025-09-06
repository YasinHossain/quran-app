/* eslint-disable react/jsx-no-undef */
/**
 * MANDATORY Architecture-Compliant Page Template
 * 
 * This template MUST be followed exactly for ALL page components.
 * Pages should be composition-only with minimal logic.
 * 
 * Usage: Copy this template and replace PageName with your page name
 */

import { memo, Suspense } from 'react';

import { ErrorBoundary } from '@/app/shared/components/ErrorBoundary';

import { PageContainer } from './components/PageContainer';
import { PageContent } from './components/PageContent';
import { PageFooter } from './components/PageFooter';
import { PageHeader } from './components/PageHeader';

import type { PageProps } from '@/types';

import { PageProvider } from '@/app/providers/PageProvider'; // If page needs specific context

interface PageNameProps {
  params: PageProps['params'];
  searchParams: PageProps['searchParams'];
}

/**
 * @description Main page component for [feature name]
 * @param props Next.js page props with params and searchParams
 * @returns Rendered page
 * @example
 * This is automatically rendered by Next.js App Router at /path
 */
export const PageName = memo(function PageName({
  params,
  searchParams,
}: PageNameProps) {
  return (
    <PageProvider initialData={searchParams}>
      <div className="min-h-screen bg-background">
        {/* ✅ REQUIRED: Mobile-first responsive layout */}
        <div className="space-y-6 p-4 md:space-y-8 md:p-6">
          <ErrorBoundary fallback={<PageErrorFallback />}>
            {/* Page Header */}
            <div className="space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
              <PageHeader 
                title="Page Title"
                params={params}
                className="md:flex-grow"
              />
              
              {/* Page Actions (mobile: below title, desktop: right side) */}
              <div className="flex space-x-2 md:space-x-4">
                <PageActions params={params} />
              </div>
            </div>

            {/* Main Content with Loading States */}
            <div className="space-y-6 md:space-y-8">
              <Suspense fallback={<ContentLoadingSkeleton />}>
                <PageContainer params={params}>
                  <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-12 md:gap-8">
                    {/* Sidebar (mobile: full width, desktop: 3 columns) */}
                    <aside className="space-y-4 md:col-span-3">
                      <Suspense fallback={<SidebarSkeleton />}>
                        <PageSidebar params={params} />
                      </Suspense>
                    </aside>

                    {/* Main Content Area (desktop: 9 columns) */}
                    <main className="space-y-6 md:col-span-9">
                      <Suspense fallback={<MainContentSkeleton />}>
                        <PageContent 
                          params={params}
                          searchParams={searchParams}
                        />
                      </Suspense>
                    </main>
                  </div>
                </PageContainer>
              </Suspense>
            </div>

            {/* Page Footer */}
            <footer className="mt-8 pt-6 border-t border-border">
              <PageFooter params={params} />
            </footer>
          </ErrorBoundary>
        </div>
      </div>
    </PageProvider>
  );
});

// Loading Components (keep minimal, extract to shared if reused)
function ContentLoadingSkeleton(): JSX.Element {
  return (
    <div className="space-y-6">
      <div className="h-32 bg-muted rounded-md animate-pulse" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-muted rounded-md animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function SidebarSkeleton(): JSX.Element {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-12 bg-muted rounded-md animate-pulse" />
      ))}
    </div>
  );
}

function MainContentSkeleton(): JSX.Element {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-muted rounded-md animate-pulse w-3/4" />
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded-md animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function PageErrorFallback(): JSX.Element {
  return (
    <div className="min-h-64 flex flex-col items-center justify-center space-y-4 p-8 text-center">
      <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center">
        <span className="text-2xl">⚠️</span>
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Something went wrong</h2>
        <p className="text-muted-foreground max-w-md">
          We encountered an error while loading this page. Please try refreshing or contact support if the problem persists.
        </p>
      </div>
      <button
        className="h-11 px-6 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        onClick={() => window.location.reload()}
      >
        Refresh Page
      </button>
    </div>
  );
}

// ✅ REQUIRED: Both named and default exports
export { PageName };
export default PageName;
