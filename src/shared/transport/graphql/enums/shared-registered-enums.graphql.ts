import { registerSharedGraphqlEnums } from '@/shared/transport/graphql/register-shared-graphql-enums';

/**
 * Side-effect import that registers all shared GraphQL enums (FilterOperator, SortDirection, etc.).
 * Import this file in your app module to ensure enums are registered before GraphQL schema generation.
 *
 * @example
 * import '@sisques-labs/nestjs-kit/registered-enums';
 */
registerSharedGraphqlEnums();
