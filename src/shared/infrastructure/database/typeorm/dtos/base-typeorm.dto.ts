/**
 * Base DTO type for TypeORM entities, including standard timestamp fields.
 *
 * @property createdAt - The date and time when the entity was created.
 * @property updatedAt - The date and time when the entity was last modified.
 */
export type BaseTypeormDto = {
  /** The creation timestamp of the entity. */
  createdAt: Date;
  /** The last update timestamp of the entity. */
  updatedAt: Date;
};
