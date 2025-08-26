import { loadMemorizationFromStorage, saveMemorizationToStorage } from './storage-utils';
import type { MemorizationRepository } from '@/domain/repositories/MemorizationRepository';
import type { MemorizationPlan } from '@/domain/entities';

export class MemorizationStorageRepository implements MemorizationRepository {
  load(): Record<string, MemorizationPlan> {
    return loadMemorizationFromStorage();
  }

  save(memorization: Record<string, MemorizationPlan>): void {
    saveMemorizationToStorage(memorization);
  }
}
