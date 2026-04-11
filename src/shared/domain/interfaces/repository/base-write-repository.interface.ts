import { Criteria } from '@/shared/domain/entities/criteria';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

/**
 * Base interface for write repositories.
 * Provides common methods that all write repositories should implement.
 *
 * @template TEntity - The aggregate entity type
 *
 * @interface IBaseWriteRepository
 */
export interface IBaseWriteRepository<TEntity> {
  /**
   * Find an entity by its id.
   *
   * @param id - The id of the entity to find.
   * @returns Promise that resolves to the entity or null if not found.
   */
  findById(id: string): Promise<TEntity | null>;

  /**
   * Find an entity by its criteria.
   *
   * @param criteria - The criteria to find the entity.
   * @returns Promise that resolves to the paginated result of the entities.
   */
  findByCriteria(criteria: Criteria): Promise<PaginatedResult<TEntity>>;
  /**
   * Save an entity (create or update).
   * This method should handle both create and update operations.
   *
   * @param entity - The entity to save.
   * @returns Promise that resolves to the saved entity.
   */
  save(entity: TEntity): Promise<TEntity>;

  /**
   * Delete an entity by id.
   *
   * @param id - The id of the entity to delete.
   * @returns Promise that resolves when the entity is deleted.
   */
  delete(id: string): Promise<void>;
}
