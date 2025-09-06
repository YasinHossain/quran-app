'use client';
import { useCallback } from 'react';
import { MemorizationPlan } from '@/types';
import { createMemorizationPlan, updateMemorizationProgress } from '../bookmark-utils';
export interface MemorizationOperations {
  addToMemorization(surahId: number, targetVerses?: number): void;
  createMemorizationPlan(surahId: number, targetVerses: number, planName?: string): void;
  updateMemorizationProgress(surahId: number, completedVerses: number): void;
  removeFromMemorization(surahId: number): void;
}
export default function useMemorizationOperations(
  memorization: Record<string, MemorizationPlan>,
  setMemorization: React.Dispatch<React.SetStateAction<Record<string, MemorizationPlan>>>
): MemorizationOperations {
  const addToMemorization = useCallback(
    (surahId: number, targetVerses = 10) => {
      const key = surahId.toString();
      if (memorization[key]) return;
      const plan = createMemorizationPlan(surahId, targetVerses);
      setMemorization((prev) => ({ ...prev, [key]: plan }));
    },
    [memorization, setMemorization]
  );
  const createPlan = useCallback(
    (surahId: number, targetVerses: number, planName?: string) => {
      const key = surahId.toString();
      const plan = createMemorizationPlan(surahId, targetVerses, planName);
      setMemorization((prev) => ({ ...prev, [key]: plan }));
    },
    [setMemorization]
  );
  const updateProgress = useCallback(
    (surahId: number, completed: number) => {
      setMemorization((prev) => updateMemorizationProgress(prev, surahId, completed));
    },
    [setMemorization]
  );
  const removeFromMemorization = useCallback(
    (surahId: number) => {
      const key = surahId.toString();
      setMemorization((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [setMemorization]
  );
  return {
    addToMemorization,
    createMemorizationPlan: createPlan,
    updateMemorizationProgress: updateProgress,
    removeFromMemorization,
  };
}
