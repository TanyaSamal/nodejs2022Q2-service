import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../user/user.interface';
import { UserService } from '../user/user.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signin(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ token: string }> {
    const login: string = authCredentialsDto.login;
    const allUsers = await this.userService.getAllUsers();
    const user = allUsers.find((user) => user.login === login);

    if (user) {
      const payload = { username: user.login, sub: user.id };
      return {
        token: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException('Incorrect login credentials!');
    }
  }

  async validateUser(login: string, pass: string): Promise<IUser> {
    const allUsers = await this.userService.getAllUsers();
    const user = allUsers.find((user) => user.login === login);

    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }
}
