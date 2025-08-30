'use client';

import React from 'react';
import BookmarksLayout from '../components/shared/BookmarksLayout';
import { CreateMemorizationModal } from '../components/CreateMemorizationModal';
import { useMemorizationPage } from './hooks/useMemorizationPage';
import { MemorizationHeader, MemorizationGrid } from './components';

export default function MemorizationPage() {
  const { memorization, chapters, modal, handleSectionChange } = useMemorizationPage();

  return (
    <>
      <CreateMemorizationModal isOpen={modal.isOpen} onClose={modal.close} />
      
      <BookmarksLayout
        activeSection="memorization"
        onSectionChange={handleSectionChange}
      >
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
