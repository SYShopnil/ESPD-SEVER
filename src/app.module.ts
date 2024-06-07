/* eslint-disable */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import configuration from './config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrudModule } from './crud/crud.module';
// import { UsersService } from './users/users.service';
// import { AppService } from './app.service';
import { CaslModule } from './casl/casl.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { WebsiteModule } from './website/website.module';
import { AdminModule } from './admin/admin.module';
import { GscModule } from './gsc/gsc.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    /*TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get('database'),
      inject: [ConfigService],
    }),*/
    PrismaModule,
    CrudModule,
    AuthModule,
    CaslModule,
    AttachmentsModule,
    WebsiteModule,
    UsersModule,
    AdminModule,
    GscModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
