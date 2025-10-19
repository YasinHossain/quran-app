'use client';

import dynamic from 'next/dynamic';

import { BookmarksLayout } from '@/app/(features)/bookmarks/components/shared/BookmarksLayout';

import { MemorizationHeader, MemorizationGrid } from './components';
import { useMemorizationPage } from './hooks/useMemorizationPage';

// Dynamic import for heavy modal component
const CreateMemorizationModal = dynamic(
  () =>
    import('../components/CreateMemorizationModal').then((mod) => ({
      default: mod.CreateMemorizationModal,
    })),
  {
    ssr: false,
  }
);

export default function MemorizationPage(): React.JSX.Element {
  const { memorization, chapters, modal, handleSectionChange } = useMemorizationPage();

  return (
    <>
      <CreateMemorizationModal isOpen={modal.isOpen} onClose={modal.close} />

      <BookmarksLayout activeSection="memorization" onSectionChange={handleSectionChange}>
        <MemorizationHeader onCreatePlan={modal.open} />
        <MemorizationGrid
          memorization={memorization}
          chapters={chapters}
          onCreatePlan={modal.open}
        />
      </BookmarksLayout>
    </>
  );
}
