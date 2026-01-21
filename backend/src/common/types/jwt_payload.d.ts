import { Role } from '../enums/user_role.enum';

export type AuthJwtPayload = {
  sub: string;
  role: Role;
};
