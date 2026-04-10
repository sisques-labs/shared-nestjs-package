import { registerEnumType } from '@nestjs/graphql';

import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';
import { LengthUnitEnum } from '@/shared/domain/enums/length-unit/length-unit.enum';
import { SortDirection } from '@/shared/domain/enums/sort-direction.enum';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { UserStatusEnum } from '@/shared/domain/enums/user-context/user/user-status/user-status.enum';

const DEFINITIONS = [
  {
    enum: FilterOperator,
    name: 'FilterOperator',
    description: 'The operator to filter by',
  },
  {
    enum: SortDirection,
    name: 'SortDirection',
    description: 'The direction to sort by',
  },
  {
    enum: LengthUnitEnum,
    name: 'LengthUnitEnum',
    description: 'The unit of the length',
  },
  {
    enum: UserRoleEnum,
    name: 'UserRoleEnum',
    description: 'The role of the user',
  },
  {
    enum: UserStatusEnum,
    name: 'UserStatusEnum',
    description: 'The status of the user',
  },
] as const;

let registered = false;

/**
 * Registers kit GraphQL enums with Nest (`registerEnumType`).
 * Call once before GraphQL schema generation (e.g. at app bootstrap or from your GraphQL module).
 */
export function registerSharedGraphqlEnums(): void {
  if (registered) {
    return;
  }
  registered = true;
  for (const { enum: enumType, name, description } of DEFINITIONS) {
    registerEnumType(enumType, { name, description });
  }
}
