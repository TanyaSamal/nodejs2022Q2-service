import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../user/user.interface';
import { UserService } from '../user/user.service';
import { AuthErrors } from './consts';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(authCredentialsDto: AuthCredentialsDto): Promise<IUser> {
    return this.userService.createUser(authCredentialsDto);
  }

  async login(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ token: string }> {
    const { login, password } = authCredentialsDto;
    if (!login || !password) {
      throw new BadRequestException(AuthErrors.INCORRECT_BODY);
    }

    const allUsers = await this.userService.getAllUsers();
    const user = allUsers.find((user) => user.login === login);

    if (user && this.validatePassword(password, user.password)) {
      const payload = { login: user.login, userId: user.id };

      return {
        token: this.jwtService.sign(payload),
      };
    } else {
      throw new ForbiddenException(AuthErrors.INVALID_CREDENTIALS);
    }
  }

  async validateUser(login: string, pass: string): Promise<IUser> {
    const allUsers = await this.userService.getAllUsers();
    const user = allUsers.find((user) => user.login === login);

    if (user && this.validatePassword(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async validatePassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compareSync(password, userPassword);
  }
}
