/**
 * Base repository interface defining common CRUD operations.
 * Generic interface that can be extended by specific repositories.
 */
export interface IRepository<TEntity, TId> {
  /**
   * Finds an entity by its unique identifier
   */
  findById(id: TId): Promise<TEntity | null>;

  /**
   * Saves an entity (create or update)
   */
  save(entity: TEntity): Promise<void>;

  /**
   * Removes an entity by its identifier
   */
  remove(id: TId): Promise<void>;

  /**
   * Checks if an entity exists by its identifier
   */
  exists(id: TId): Promise<boolean>;
}
