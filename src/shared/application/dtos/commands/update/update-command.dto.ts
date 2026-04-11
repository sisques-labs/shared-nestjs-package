/**
 * Data Transfer Object for update commands.
 *
 * @remarks
 * This interface is used to encapsulate the identifier of the entity to be updated.
 *
 * @property id - The unique identifier of the entity to delete.
 */
export interface IUpdateCommandDto {
  /** The unique identifier of the entity to update. */
  id: string;
}
