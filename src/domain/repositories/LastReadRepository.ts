export interface LastReadRepository {
  load(): Record<string, number>;
  save(lastRead: Record<string, number>): void;
}
