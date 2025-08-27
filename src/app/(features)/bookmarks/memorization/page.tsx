'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookmarksSidebar } from '../components/BookmarksSidebar';
import { CreateMemorizationModal } from '../components/CreateMemorizationModal';
import { useHeaderVisibility } from '@/presentation/(features)/layout/context/HeaderVisibilityContext';
import { useMemorizationPage } from './hooks/useMemorizationPage';
import { MemorizationHeader, MemorizationGrid } from './components';

export default function MemorizationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isHidden } = useHeaderVisibility();
  const { memorization, chapters, modal, handleSectionChange } = useMemorizationPage();

  return (
    <>
      <CreateMemorizationModal isOpen={modal.isOpen} onClose={modal.close} />

      <div className="flex h-[calc(100vh-4rem)] mt-16 bg-background relative">
        {/* Left Sidebar */}
        <aside className="w-80 h-full bg-surface border-r border-border hidden lg:block">
          <BookmarksSidebar activeSection="memorization" onSectionChange={handleSectionChange} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 h-full overflow-hidden">
          <div
            className={`h-full overflow-y-auto p-4 sm:p-6 md:p-8 pb-20 transition-all duration-300 ${
              isHidden
                ? 'pt-4 sm:pt-6 md:pt-8'
                : 'pt-[calc(3.5rem+1rem+env(safe-area-inset-top))] sm:pt-[calc(4rem+1.5rem+env(safe-area-inset-top))] md:pt-[calc(4rem+2rem+env(safe-area-inset-top))]'
            }`}
          >
            <MemorizationHeader />

            <MemorizationGrid
              memorization={memorization}
              chapters={chapters}
              onCreatePlan={modal.open}
            />
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-surface-overlay/60 z-[100] lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-80 bg-surface border-r border-border z-[110] lg:hidden"
            >
              <BookmarksSidebar
                activeSection="memorization"
                onSectionChange={handleSectionChange}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
