'use client';

import dynamic from 'next/dynamic';

import { BookmarksLayout } from '@/app/(features)/bookmarks/components/shared/BookmarksLayout';

import { PlannerHeader, PlannerGrid } from './components';
import { usePlannerPage } from './hooks/usePlannerPage';

// Dynamic import for heavy modal component
const CreatePlannerModal = dynamic(
  () =>
    import('../components/CreatePlannerModal').then((mod) => ({
      default: mod.CreatePlannerModal,
    })),
  {
    ssr: false,
  }
);

export default function PlannerPage(): React.JSX.Element {
  const { planner, chapters, modal, handleSectionChange } = usePlannerPage();

  return (
    <>
      <CreatePlannerModal isOpen={modal.isOpen} onClose={modal.close} />

      <BookmarksLayout activeSection="planner" onSectionChange={handleSectionChange}>
        <PlannerHeader onCreatePlan={modal.open} />
        <PlannerGrid planner={planner} chapters={chapters} />
      </BookmarksLayout>
    </>
  );
}
