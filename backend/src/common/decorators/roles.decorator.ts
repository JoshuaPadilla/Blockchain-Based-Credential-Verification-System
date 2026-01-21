import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/user_role.enum';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: [Role, ...Role[]]) =>
  SetMetadata('roles', roles);
