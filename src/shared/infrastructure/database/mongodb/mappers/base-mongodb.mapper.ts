import { Injectable } from '@nestjs/common';

import { BaseMongoDto } from '@/shared/infrastructure/database/mongodb/dtos/base-mongo.dto';

/**
 * Base mapper between domain view models and MongoDB document DTOs.
 *
 * @remarks
 * Extend with concrete `TMongoDto` (typically intersecting {@link BaseMongoDto}) and your
 * view model type. Implement {@link toViewModel} and {@link toMongoData} in the subclass.
 */
@Injectable()
export abstract class BaseMongoDBMapper<
  TViewModel,
  TMongoDto extends BaseMongoDto,
  TAggregate,
> {
  /**
   * Maps a persisted MongoDB document to the domain view model.
   */
  public abstract toViewModel(doc: TMongoDto): TViewModel;

  /**
   * Maps a view model to the shape stored in MongoDB.
   */
  public abstract toMongoData(viewModel: TViewModel): TMongoDto;

  /**
   * Converts a MongoDB document to a prompt aggregate.
   *
   * @param doc - The MongoDB document to convert
   * @returns The prompt aggregate
   */
  public abstract toAggregate(doc: TMongoDto): TAggregate;

  /**
   * Normalizes driver values that may be {@link Date} or serialized strings.
   */
  protected normalizeMongoDate(value: Date | string): Date {
    return value instanceof Date ? value : new Date(value);
  }
}
