import { Global, Module } from '@nestjs/common';

import { MongoMasterService } from '@/shared/infrastructure/database/mongodb/services/mongo-master/mongo-master.service';

const SERVICES = [MongoMasterService];

/**
 * Opt-in MongoDB integration. Import only in apps that use MongoDB.
 * Expects `MONGODB_URI` and `MONGODB_DATABASE` via `ConfigService` (provide `ConfigModule.forRoot` in the app).
 */
@Global()
@Module({
  providers: [...SERVICES],
  exports: [...SERVICES],
})
export class MongoModule {}
