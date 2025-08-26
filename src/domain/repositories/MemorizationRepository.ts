import type { MemorizationPlan } from '@/domain/entities';

export interface MemorizationRepository {
  load(): Record<string, MemorizationPlan>;
  save(memorization: Record<string, MemorizationPlan>): void;
}
