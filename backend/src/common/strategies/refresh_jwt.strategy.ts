import { Inject, Injectable } from '@nestjs/common';
import * as config from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from 'src/configs/jwt.config';
import { AuthJwtPayload } from 'src/common/types/jwt_payload';
import refresh_jwtConfig from 'src/configs/refresh_jwt.config';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    @Inject(refresh_jwtConfig.KEY)
    private refreshJwtConfiguration: config.ConfigType<
      typeof refresh_jwtConfig
    >,
  ) {
    super({
      jwtFromRequest: (req) => {
        if (req && req.cookies) {
          return req.cookies['refresh_token']; // Match the name in your login cookie
        }
        return null;
      },
      secretOrKey: refreshJwtConfiguration.secret as any,
      ignoreExpiration: false,
    });
  }

  validate(payload: AuthJwtPayload) {
    return { id: payload.sub, role: payload.role };
  }
}
