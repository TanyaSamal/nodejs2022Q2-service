import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRE_TIME },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtModule, JwtStrategy, PassportModule],
})
export class AuthModule {}
