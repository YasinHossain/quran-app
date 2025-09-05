'use client';

import dynamic from 'next/dynamic';

import { MemorizationHeader, MemorizationGrid } from './components';
import { useMemorizationPage } from './hooks/useMemorizationPage';
import { BookmarksLayout } from '../components/shared/BookmarksLayout';

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

export default function MemorizationPage() {
  const { memorization, chapters, modal, handleSectionChange } = useMemorizationPage();

  return (
    <>
      <CreateMemorizationModal isOpen={modal.isOpen} onClose={modal.close} />

      <BookmarksLayout activeSection="memorization" onSectionChange={handleSectionChange}>
        <MemorizationHeader />
        <MemorizationGrid
          memorization={memorization}
          chapters={chapters}
          onCreatePlan={modal.open}
        />
      </BookmarksLayout>
    </>
  );
}
