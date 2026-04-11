import { Injectable } from '@nestjs/common';

import { BasePaginatedResultDto } from '@/shared/transport/graphql/dtos/responses/base-paginated-result/base-paginated-result.dto';
import { PaginatedResult } from '@/shared/domain/entities/paginated-result.entity';

/**
 * Base mapper for transforming between domain view models and GraphQL response DTOs.
 *
 * @typeParam TViewModel - The shape of the domain view model.
 * @typeParam TResponseDto - The GraphQL response DTO shape.
 * @typeParam TPaginatedResponseDto - The paginated GraphQL response DTO, should extend {@link BasePaginatedResultDto}.
 *
 * @remarks
 * Extend this class to define field-level mapping between the domain layer and the GraphQL transport layer.
 * Implement mapping logic in the subclass by overriding the abstract methods.
 */
@Injectable()
export abstract class BaseGraphQLMapper<
  TViewModel,
  TResponseDto,
  TPaginatedResponseDto extends BasePaginatedResultDto,
> {
  /**
   * Maps a domain view model to a GraphQL response DTO.
   *
   * @param viewModel - The domain view model to convert.
   * @returns The mapped GraphQL response DTO.
   */
  public abstract toResponseDto(viewModel: TViewModel): TResponseDto;

  /**
   * Maps a paginated result of domain view models to a paginated GraphQL response DTO.
   *
   * @param paginatedResult - The paginated result to convert.
   * @returns The mapped paginated GraphQL response DTO.
   */
  public abstract toPaginatedResponseDto(
    paginatedResult: PaginatedResult<TViewModel>,
  ): TPaginatedResponseDto;
}
