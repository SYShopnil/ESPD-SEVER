

/* eslint-disable */

import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdminTeacherRequestContoller } from './controllers/admin-teacher-request.controller';
import { AdminTeacherRequestService } from './services/admin-teacher-reaquest.service';
import { ConfigModule } from '@nestjs/config';
import { SeederController } from './controllers/seeder.controller';
import { SeederService } from './services/seeder.service';
import { AdminLevelContoller } from './controllers/admin-level.controller';
import { AdminLevelService } from './services/admin-level.service';
import { AdminTeacherContoller } from './controllers/admin-register-teacher.controller';
import { AdminTeacherService } from './services/admin-register-teacher-service';
import { AdminPasswordController } from './controllers/admin-password.controller';
import { AdminPasswordService } from './services/admin-password.service';


@Module({
  imports: [
    PrismaModule, ConfigModule
  ],
  controllers: [
    AdminTeacherRequestContoller, SeederController, AdminLevelContoller, AdminTeacherContoller, AdminPasswordController
  ],
  providers: [
    AdminTeacherRequestService, SeederService, AdminLevelService, AdminTeacherService, AdminPasswordService
  ],
  exports: [AdminTeacherRequestService]
})
export class AdminModule { }
