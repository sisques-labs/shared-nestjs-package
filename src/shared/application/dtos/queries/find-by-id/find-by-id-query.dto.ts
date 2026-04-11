/**
 * Data Transfer Object for querying by unique identifier.
 *
 * @remarks
 * This interface is used to encapsulate the identifier required to find a specific entity, such as a plant, by its unique id.
 *
 * @interface
 */
export interface IFindByIdQueryDto {
  /**
   * The unique identifier of the entity to find.
   */
  id: string;
}
