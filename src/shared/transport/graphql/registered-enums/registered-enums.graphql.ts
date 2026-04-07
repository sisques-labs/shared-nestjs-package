import { registerEnumType } from '@nestjs/graphql';

import { FilterOperator } from '@/shared/domain/enums/filter-operator.enum';
import { SortDirection } from '@/shared/domain/enums/sort-direction.enum';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';
import { UserStatusEnum } from '@/shared/domain/enums/user-context/user/user-status/user-status.enum';

/**
 * Registers shared GraphQL enums.
 *
 * @remarks
 * Each module should register its own enums in its own module file.
 * This file only contains shared enums.
 *
 * TODO: Move UserRoleEnum and UserStatusEnum to user module
 */
const registeredEnums = [
  // Shared enums
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
  // User module enums (TODO: Move to user module)
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
];

for (const { enum: enumType, name, description } of registeredEnums) {
  registerEnumType(enumType, { name, description });
}
