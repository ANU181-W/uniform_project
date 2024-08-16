import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { CONSTANTS } from 'src/Constants copy';

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.register({
      secret: CONSTANTS.secretKey,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [LocalStrategy, JwtStrategy, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
