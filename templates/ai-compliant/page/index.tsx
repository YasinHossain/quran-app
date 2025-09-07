/* eslint-disable react/jsx-no-undef */
/**
 * MANDATORY Architecture-Compliant Page Template
 *
 * Usage: Copy this template and replace PageName with your page name.
 */
import { memo, Suspense } from 'react';

import { ErrorBoundary } from '@/app/shared/components/error-boundary';

import { PageContainer } from './components/PageContainer';
import { PageContent } from './components/PageContent';
import { PageFooter } from './components/PageFooter';
import { PageHeader } from './components/PageHeader';
import {
  ContentLoadingSkeleton,
  MainContentSkeleton,
  PageErrorFallback,
  SidebarSkeleton,
} from './skeletons';

import type { PageProps } from '@/types';

import { PageProvider } from '@/app/providers/PageProvider';

interface PageNameProps {
  params: PageProps['params'];
  searchParams: PageProps['searchParams'];
}

export const PageName = memo(function PageName({
  params,
  searchParams,
}: PageNameProps) {
  return (
    <PageProvider initialData={searchParams}>
      <div className="min-h-screen bg-background">
        <div className="space-y-6 p-4 md:space-y-8 md:p-6">
          <ErrorBoundary fallback={<PageErrorFallback />}>
            <div className="space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
              <PageHeader
                title="Page Title"
                params={params}
                className="md:flex-grow"
              />

              <div className="flex space-x-2 md:space-x-4">
                <PageActions params={params} />
              </div>
            </div>

            <div className="space-y-6 md:space-y-8">
              <Suspense fallback={<ContentLoadingSkeleton />}>
                <PageContainer params={params}>
                  <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-12 md:gap-8">
                    <aside className="space-y-4 md:col-span-3">
                      <Suspense fallback={<SidebarSkeleton />}>
                        <PageSidebar params={params} />
                      </Suspense>
                    </aside>

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

            <footer className="mt-8 pt-6 border-t border-border">
              <PageFooter params={params} />
            </footer>
          </ErrorBoundary>
        </div>
      </div>
    </PageProvider>
  );
});

export { PageName };
export default PageName;
