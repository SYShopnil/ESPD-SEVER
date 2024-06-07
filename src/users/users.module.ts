import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersController } from './users.controller';
import {DatabaseController} from "./database.controller";

@Module({
  providers: [UsersService],
  exports: [UsersService],
  imports: [
    PrismaModule
  ],
  controllers: [
    UsersController,
      DatabaseController
  ]
})
export class UsersModule {}
