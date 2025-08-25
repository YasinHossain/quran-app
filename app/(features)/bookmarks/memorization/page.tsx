'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookmarksSidebar } from '../components/BookmarksSidebar';
import { CircularProgress } from '../components/CircularProgress';
import { CreateMemorizationModal } from '../components/CreateMemorizationModal';
import { BrainIcon, PlusIcon } from '@/app/shared/icons';
import { useRouter } from 'next/navigation';
import { useHeaderVisibility } from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { useBookmarks } from '@/app/providers/BookmarkContext';
import { useModal } from '@/app/shared/hooks/useModal';

export default function MemorizationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { isHidden } = useHeaderVisibility();
  const { memorization, chapters } = useBookmarks();
  const modal = useModal();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSectionChange = (section: string) => {
    if (section === 'bookmarks') {
      router.push('/bookmarks');
    } else if (section === 'pinned') {
      router.push('/bookmarks/pinned');
    } else if (section === 'last-read') {
      router.push('/bookmarks/last-read');
    } else {
      router.push('/bookmarks/memorization');
    }
  };

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
            {/* Memorization Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-sm">
                  <BrainIcon size={20} className="text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg font-bold text-foreground">Memorization Plan</h1>
                  <p className="text-xs text-muted">Track your memorization progress</p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className=""
            >
              {!memorization || Object.keys(memorization).length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
                    <BrainIcon className="w-8 h-8 text-muted" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Memorization Plans</h3>
                  <p className="text-muted max-w-md mx-auto mb-6">
                    Start your memorization journey by creating a plan to track your progress.
                  </p>
                  <button
                    onClick={modal.open}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent-hover transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <PlusIcon size={20} />
                    Create Memorization Plan
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(memorization).map(([surahId, plan]) => {
                    const chapter = chapters.find((c) => c.id === Number(surahId));
                    const percent = Math.min(100, Math.max(0, Math.round((plan.completedVerses / plan.targetVerses) * 100)));
                    
                    const handleNavigate = () => {
                      router.push(`/surah/${surahId}`);
                    };

                    return (
                      <motion.div
                        key={surahId}
                        role="button"
                        tabIndex={0}
                        aria-label={`Continue memorizing ${chapter?.name_simple || `Surah ${surahId}`} - ${percent}% complete`}
                        onClick={handleNavigate}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleNavigate();
                          }
                        }}
                        className="bg-surface rounded-2xl shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent hover:shadow-xl transition-all duration-300 border border-border/50 p-4 sm:p-6 
                        hover:border-accent/20 flex flex-col h-full relative z-10"
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: parseInt(surahId) * 0.1 }}
                      >
                        {/* Header with progress circle and info */}
                        <div className="flex flex-col items-center text-center mb-4">
                          <div className="mb-4">
                            <CircularProgress 
                              percentage={percent}
                              label="Completed"
                              size={100}
                              strokeWidth={10}
                            />
                          </div>
                          
                          <div className="mb-3">
                            <h3 className="text-lg font-bold text-foreground truncate mb-1">
                              {chapter?.name_simple || `Surah ${surahId}`}
                            </h3>
                            <p className="text-sm text-muted truncate">
                              {chapter?.name_arabic}
                            </p>
                          </div>
                        </div>

                        {/* Progress Details */}
                        <div className="flex-1 space-y-3 text-center">
                          <div className="bg-accent/5 rounded-lg p-3">
                            <div className="flex items-center justify-center gap-2 text-sm mb-2">
                              <div className="w-2 h-2 bg-accent rounded-full"></div>
                              <span className="text-muted">Progress:</span>
                              <span className="font-semibold text-foreground">
                                {plan.completedVerses} / {plan.targetVerses}
                              </span>
                            </div>
                            
                            <div className="text-xs text-muted space-y-1">
                              <div>From 1:1 - 1:{plan.completedVerses > 0 ? plan.completedVerses : 1}</div>
                              <div>Now: Verse {Math.min(plan.completedVerses + 1, plan.targetVerses)}</div>
                            </div>
                          </div>
                          
                          {/* Status Badge */}
                          <div className="flex items-center justify-between">
                            <div className="text-left">
                              <div className="text-xl font-bold text-accent">{percent}%</div>
                              <div className="text-xs text-muted">Complete</div>
                            </div>
                            
                            <div className="inline-flex items-center px-3 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium">
                              <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></div>
                              5 Days Left
                            </div>
                          </div>
                          
                          <div className="text-xs text-muted pt-2 border-t border-border/50">
                            {plan.completedVerses === plan.targetVerses ? 'Completed' : 'In Progress'} • 
                            Started {new Date(plan.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
            
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
              <BookmarksSidebar activeSection="memorization" onSectionChange={handleSectionChange} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}