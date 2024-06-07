import { Module } from '@nestjs/common';
// import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from '../email/email.module';
// import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { JwtSignService } from './jwt.sign.service';
// import { AuthController } from './auth.controller';
// import { RegisterController } from './register.controller';
import { LoginController } from './login.controller';
// import {VerifyEmailController} from './verify-email.controller'
// import {VerifyEmailService} from './verify-email.service';
// import {RegisterService} from './register.service';
// import {InfoService} from './info.service';
import {LoginService} from './login.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {JwtStrategy} from './jwt/jwt.strategy';
import { AdminLoginController } from './admin.login.controller';
import { LocalAdminStrategy } from "./local-admin.auth";
import { AdminPasswordResetService } from './admin.password-reset.service';

@Module({
  imports: [
    EmailModule,
    PassportModule.register({ defaultStrategy: 'jwt', property: 'user', session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt_secret'),
        // privateKey: configService.get<string>('keys.privateKey'),
        // publicKey: configService.get<string>('keys.publicKey'),
        signOptions: { /*expiresIn: '86400s', */algorithm: 'HS256' },
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    JwtModule,
    // UsersModule
  ],
  providers: [
    AuthService,
    LoginService,
    AdminPasswordResetService,
    // InfoService,
    // RegisterService,
    JwtStrategy,
    LocalAdminStrategy,
    // VerifyEmailService,
    JwtSignService
  ],
  controllers: [
    // AuthController,
    // VerifyEmailController,
    // RegisterController,
    LoginController,
    AdminLoginController,
  ],
})
export class AuthModule {}
