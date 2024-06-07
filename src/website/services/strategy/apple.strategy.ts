import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy,VerifyCallback } from "passport-apple";


@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy,'apple') {

  constructor() {
    super({
      clientID: process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET_KEY,
      callbackURL: `${process.env.APP_URL}/api/v1/auth/apple/redirect`,
      scope: ['email', 'profile'],
    });
  }

  async validate (accessToken: string, refreshToken: string, profile: any, done: 
    VerifyCallback): Promise<any> {
    done(null, profile);
  }
}