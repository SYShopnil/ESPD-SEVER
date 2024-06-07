/* eslint-disable */

import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HomeController } from './controllers/home.controller';
import { HomeService } from "./services/home.service";
import { TeacherRequestController } from './controllers/teacherRequest.controller';
import { TeacherRequestService } from './services/teacherRequest.service';
import { StudentAuthController } from './controllers/student-auth.controller';
import { TeacherAuthController } from './controllers/teacher-auth.controller';
import { StudentAuthService } from './services/student-auth.service';
import { FindTutorController } from './controllers/tutor-find.controller';
import { FindTutorService } from './services/find-tutor.service';

import { TeacherController } from './controllers/teacher.controller';
import { TeacherService } from './services/teacher.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtSignService } from './services/jwt.sign.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TeacherAuthService } from './services/teacher-auth.service';
import { StudentController } from './controllers/student.controller';
import { StudentService } from './services/student.service';
import { VerifyOtpAuthControlller } from './controllers/verify-otp-auth.controller';
import { VerifyOtpAuthService } from './services/verify-otp-auth.service';
import { ReviewService } from './services/review.service';
import { ReviewController } from './controllers/review.controller';
import { WeeklyHoursService } from './services/weekly-hours.service';
import { FavouriteController } from './controllers/favourite.controller';
import { FavouriteService } from './services/favourite.service';

import { SocialAuthController } from './controllers/social-auth.controller';
import { SocialAuthService } from './services/social-auth.service';
import { GoogleStrategy } from './services/strategy/google.strategy';
import { FacebookStrategy } from './services/strategy/facebook.strategy';
import { BookingController } from './controllers/booking.controller';
import { BookingService } from './services/booking.service';
import { StripeService } from './services/stripe.service';
import { TeacherDashboardService } from './services/teacher-dashboard.service';
import { TeacherDashboardController } from './controllers/teacher-dashboard.controller';
import { TeacherContactMessageController } from './controllers/teacher-contact-message.controller';
import { TeacherContactMessageService } from './services/teacher-contact-message.service';
import { StudentDashboardCotroller } from './controllers/student-dashboard.controller';
import { StudentDashboardService } from './services/student-dashboard.service';
import { StripeController } from './controllers/stripe.controller';
import { SettingController } from './controllers/setting.controller';
import { SettingService } from './services/setting.service';
import { BlogController } from './controllers/blog.controller';
import { BlogService } from './services/blog.service';
import { FeaturesController } from './controllers/features.controller';
import { FeaturesService } from './services/features.service';
import { GoogleMeetService } from './services/google-meet.service';
import { ResetPasswordController } from "./controllers/reset-password.controller";
import { ResetPasswordService } from "./services/reset-password.service";
import { EmailModule } from "../email/email.module";
import {GoogleCalendarController} from "./controllers/google-calendar.controller";
import {GoogleCalendarStrategy} from "./services/strategy/google-calendar.strategy";
import {BookingNotificationService} from "./services/booking-notification.service";


@Module({
  imports: [
    PrismaModule,
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
    ConfigModule,
    EmailModule
  ],
  controllers: [
    HomeController,
    TeacherRequestController,
    StudentAuthController,
    TeacherAuthController,
    TeacherContactMessageController,
    StudentDashboardCotroller,
    FindTutorController,
    TeacherController,
    StudentController,
    VerifyOtpAuthControlller,
    ReviewController,
    FavouriteController,
    SocialAuthController,
    BookingController,
    TeacherDashboardController,
    SettingController,
    StripeController,
    BlogController,
    FeaturesController,
    ResetPasswordController,
    GoogleCalendarController
  ],
  providers: [
    HomeService,
    TeacherRequestService,
    StudentAuthService,
    JwtSignService,
    TeacherAuthService,
    StudentDashboardService,
    FindTutorService,
    TeacherService,
    StudentService,
    VerifyOtpAuthService,
    ReviewService,
    WeeklyHoursService,
    FavouriteService,
    SocialAuthService,
    GoogleStrategy,
    FacebookStrategy,
    GoogleCalendarStrategy,
    BookingService,
    StripeService,
    TeacherDashboardService,
    TeacherContactMessageService,
    SettingService,
    BlogService,
    FeaturesService,
    GoogleMeetService,
    ResetPasswordService,
    BookingNotificationService
  ],
})
export class WebsiteModule { }
