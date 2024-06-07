import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

    constructor() {
        super({
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET_KEY,
          callbackURL: `${process.env.APP_URL}/api/v1/auth/google/redirect`,
          scope: ['email', 'profile'],
        });
      }

  async validate (accessToken: string, refreshToken: string, 
    profile: any, done: VerifyCallback): Promise<any> {
    done(null, profile);
  }
}