import { Module } from '@nestjs/common';
import EmailService from './email.service';
import { ConfigModule } from '@nestjs/config';
import SmsService from "./sms.service";

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [
    EmailService,
    SmsService
  ],
  exports: [
    EmailService,
    SmsService
  ],
})
export class EmailModule {}
