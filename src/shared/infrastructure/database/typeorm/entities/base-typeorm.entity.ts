import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Base abstract entity for TypeORM models with standard fields.
 *
 * @remarks
 * This entity defines a UUID primary key (`id`) and standard auditing columns:
 * - `createdAt` (creation timestamp)
 * - `updatedAt` (last update timestamp)
 * - `deletedAt` (soft delete timestamp, nullable)
 *
 * Extend this base class in your application entities to ensure consistency
 * in primary key and timestamp management.
 */
export abstract class BaseTypeormEntity {
  /**
   * Unique identifier for the entity (UUID).
   *
   * @type {string}
   * @readonly
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The timestamp when the entity was created.
   *
   * @type {Date}
   * @readonly
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * The timestamp when the entity was last updated.
   *
   * @type {Date}
   * @readonly
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * The timestamp when the entity was soft-deleted.
   *
   * @type {(Date | null)}
   * @default null
   */
  @DeleteDateColumn()
  deletedAt: Date | null = null;
}
