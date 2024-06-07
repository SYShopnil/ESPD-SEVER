import {Injectable, UnauthorizedException} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

/*
* special strategy to be used only with teachers. To get access to their calendar so that
* calendar event with google meet link can be created automatically after each booking
* */
@Injectable()
export class GoogleCalendarStrategy extends PassportStrategy(Strategy, 'google-calendar') {

    constructor() {
        super({
          clientID: process.env.GOOGLE_CALENDAR_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CALENDAR_CLIENT_SECRET_KEY,
          callbackURL: `${process.env.APP_URL}/api/v1/calendar/google/redirect`,
          scope: ['email', 'profile', 'https://www.googleapis.com/auth/calendar'],
            accessType: 'offline',
            prompt: 'consent'
        });
      }

    authorizationParams(): { [key: string]: string; } {
        return ({
            access_type: 'offline'
        });
    };

    async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        if (!profile) {
            throw new UnauthorizedException();
        }
        return { accessToken, profile, refreshToken };
    }
}
