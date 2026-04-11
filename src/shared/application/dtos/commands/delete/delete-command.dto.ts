/**
 * Data Transfer Object for delete commands.
 *
 * @remarks
 * This interface is used to encapsulate the identifier of the entity to be deleted.
 *
 * @property id - The unique identifier of the entity to delete.
 */
export interface IDeleteCommandDto {
  /** The unique identifier of the entity to delete. */
  id: string;
}
