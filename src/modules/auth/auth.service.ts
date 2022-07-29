import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../user/user.interface';
import { UserService } from '../user/user.service';
import { AuthErrors } from './consts';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload, JWTResponce } from './jwt.interface';
import { ConfigService } from '@nestjs/config';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(authCredentialsDto: AuthCredentialsDto): Promise<IUser> {
    return this.userService.createUser(authCredentialsDto);
  }

  async login(authCredentialsDto: AuthCredentialsDto): Promise<JWTResponce> {
    const { login, password } = authCredentialsDto;
    if (!login || !password) {
      throw new BadRequestException(AuthErrors.INCORRECT_BODY);
    }

    const allUsers = await this.userService.getAllUsers();
    const user = allUsers.find((user) => user.login === login);

    if (user && this.validatePassword(password, user.password)) {
      const payload: JwtPayload = { login: user.login, userId: user.id };

      return await this.issueTokenPair(payload);
    } else {
      throw new ForbiddenException(AuthErrors.INVALID_CREDENTIALS);
    }
  }

  async validateUser(userId: string): Promise<IUser> {
    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new UnauthorizedException(AuthErrors.UNAUTHORIZED);
    }

    return user;
  }

  async validatePassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    return bcrypt.compareSync(password, userPassword);
  }

  async issueTokenPair(payload: JwtPayload): Promise<JWTResponce> {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('TOKEN_EXPIRE_TIME'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('TOKEN_REFRESH_EXPIRE_TIME'),
    });

    return { accessToken, refreshToken };
  }

  async getUserIfRefreshTokenMatches(refreshToken: string): Promise<IUser> {
    if (!refreshToken) {
      throw new UnauthorizedException(AuthErrors.NO_REFRESH_TOKEN);
    }

    try {
      const decoded = await this.decodeRefreshToken(refreshToken);

      return await this.userService.getUserById(decoded.userId);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new ForbiddenException(AuthErrors.REFRESH_EXPIRED);
      } else {
        throw new ForbiddenException(AuthErrors.REFRESH_MALFORMED);
      }
    }
  }

  private async decodeRefreshToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token);
  }
}
