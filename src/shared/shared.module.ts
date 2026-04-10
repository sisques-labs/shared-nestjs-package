import { Global, Module } from '@nestjs/common';

import { MutationResponseGraphQLMapper } from '@/shared/transport/graphql/mappers/mutation-response/mutation-response.mapper';

// Import enums for GraphQL
import '@/shared/transport/graphql/enums/shared-registered-enums.graphql';

const RESOLVERS = [];

const SERVICES = [];

const QUERY_HANDLERS = [];

const COMMAND_HANDLERS = [];

const EVENT_HANDLERS = [];

const FACTORIES = [];

const MAPPERS = [MutationResponseGraphQLMapper];

const REPOSITORIES = [];

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    ...RESOLVERS,
    ...SERVICES,
    ...QUERY_HANDLERS,
    ...COMMAND_HANDLERS,
    ...EVENT_HANDLERS,
    ...FACTORIES,
    ...MAPPERS,
    ...REPOSITORIES,
  ],
  exports: [
    ...RESOLVERS,
    ...SERVICES,
    ...QUERY_HANDLERS,
    ...COMMAND_HANDLERS,
    ...EVENT_HANDLERS,
    ...FACTORIES,
    ...MAPPERS,
    ...REPOSITORIES,
  ],
})
export class SharedModule {}
