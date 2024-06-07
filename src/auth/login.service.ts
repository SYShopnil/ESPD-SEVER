import {Injectable} from '@nestjs/common';
import EmailService from '../email/email.service';
import {PrismaService} from '../prisma/prisma.service';
import {JwtService} from '@nestjs/jwt';
import {User} from '@prisma/client';
import {JwtSignService} from './jwt.sign.service';
import * as bcryptjs from 'bcryptjs'
import {ConfigService} from '@nestjs/config';
import {Role} from './dto/role.enum';

@Injectable()
export class LoginService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly jwtSignService: JwtSignService,
    private readonly emailService: EmailService,
    private readonly prismaService: PrismaService,
  ) {}

  async loginUser(phone: string): Promise<any> {
    return true
  }

  /*
  * call FCM api to verify phone number
  * */
  async verifyPhoneNumber(phone: string, idToken: string): Promise<any> {
    if (process.env.NODE_ENV === 'development') return true;

    const payload = {
      idToken
    };

    const options = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    }

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${this.configService.get('fcm_web_api_key')}`;

    try {
      const response = await fetch(url, options)
      // console.log(response.status);
      if (response.status !== 200) {
        return false;
      }
      const jsonResponse = await response.json();
      // console.log('JSON response', jsonResponse);
      /*
      * JSON response
       {
          kind: 'identitytoolkit#GetAccountInfoResponse',
          users: [
            {
              localId: '1rLn4hbmukaXGD3DkkESG7sRQ873',
              providerUserInfo: [Array],
              lastLoginAt: '1690798443234',
              createdAt: '1689935976388',
              phoneNumber: '+8801345678912',
              lastRefreshAt: '2023-07-31T10:14:05.695473Z'
            }
          ]
        }
      * */
      if (jsonResponse?.users && jsonResponse.users.length
        && jsonResponse.users[0].phoneNumber === phone) {
        return true;
      }

      return false;
    } catch(err) {
      console.log('ERROR', err);
      return false;
    }

    return false;

  }

  async loginAdminUser(user: User): Promise<any> {
    const access_token = this.jwtSignService.signJwt(user, Role.Admin);
    return {
      ...user,
      access_token
    };
  }

  async createAdminUser(email: string, first_name:string, last_name:string, password: string): Promise<any> {
    const hash = bcryptjs.hashSync(password.toString(), 10);
    const user = await this.prismaService.adminUser.create({
      data: {
        email,
        first_name,
        last_name,
        password: hash
      }
    });
    return user;
  }

}

