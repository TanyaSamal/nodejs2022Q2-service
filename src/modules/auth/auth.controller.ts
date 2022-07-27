import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { IUser } from '../user/user.interface';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

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
  ): Promise<{ token: string }> {
    return this.authService.login(authCredentialsDto);
  }
}
