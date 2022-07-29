import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUser } from '../user/user.interface';
import { AuthService } from './auth.service';
import { AuthErrors } from './consts';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  async validate({ userId }: JwtPayload): Promise<IUser> {
    if (!userId) {
      throw new ForbiddenException(AuthErrors.REFRESH_MALFORMED);
    }

    const user = await this.authService.validateUser(userId);

    if (!user) {
      throw new UnauthorizedException(AuthErrors.UNAUTHORIZED);
    }

    return user;
  }
}
