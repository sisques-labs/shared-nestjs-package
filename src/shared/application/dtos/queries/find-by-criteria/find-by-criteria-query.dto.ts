import { Criteria } from '@/shared/domain/entities/criteria';

/**
 * Data Transfer Object for find-by-criteria queries.
 *
 * @remarks
 * Encapsulates {@link Criteria} for list/search handlers. Boundaries (HTTP, GraphQL)
 * typically map into a {@link Criteria} instance before constructing the query object.
 */
export interface IFindByCriteriaQueryDto {
  /** Search filters, sorts, and pagination. */
  criteria: Criteria;
}
