import { Collection } from 'mongodb';

import { BaseMongoDatabaseRepository } from '@/shared/infrastructure/database/mongodb/base-mongo/base-mongo-database.repository';
import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';

/**
 * Base class for MongoDB master database repositories.
 * Extends BaseMongoDatabaseRepository to provide common MongoDB operations.
 */
export class BaseMongoMasterRepository extends BaseMongoDatabaseRepository {
  constructor(protected readonly mongoMasterService: MongoMasterService) {
    super();
  }

  /**
   * Returns the MongoDB collection for this repository (delegates to {@link MongoMasterService}).
   */
  protected getCollection(collectionName: string): Collection {
    return this.mongoMasterService.getCollection(collectionName);
  }
}
