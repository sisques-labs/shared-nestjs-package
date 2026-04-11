import { Global, Module } from '@nestjs/common';

import { MongoService } from '@/shared/infrastructure/database/mongodb/services/mongo.service';

const SERVICES = [MongoService];

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
