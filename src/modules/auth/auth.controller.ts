import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IUser } from '../user/user.interface';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JWTResponce } from './jwt.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(201)
  async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<IUser> {
    return this.authService.signup(authCredentialsDto);
  }

  @Post('login')
  @HttpCode(200)
  async signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<JWTResponce> {
    return this.authService.login(authCredentialsDto);
  }

  @HttpCode(200)
  @UseGuards(AuthGuard('jwt-refresh-token'))
  @Post('refresh')
  async refreshToken(@Body() { refreshToken }: JWTResponce) {
    const user = await this.authService.getUserIfRefreshTokenMatches(
      refreshToken,
    );

    if (user) {
      const userInfo = {
        login: user.login,
        userId: user.id,
      };

      return this.authService.issueTokenPair(userInfo);
    } else {
      return null;
    }
  }
}
