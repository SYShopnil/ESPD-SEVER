import { Injectable } from '@nestjs/common';
import EmailService from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';
import * as bcryptjs from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { JwtSignService } from './jwt.sign.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminPasswordResetService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly jwtSignService: JwtSignService,
    private readonly emailService: EmailService,
    private readonly prismaService: PrismaService,
  ) { }

  /*
  * if an admin email is found in DB, send password reset code
  * if email not found in DB, do nothing
  * */
  async sendPasswordResetCodeToEmail(email: string): Promise<any> {
    const user = await this.prismaService.adminUser.findFirst({
      where: {
        email
      }
    });

    if (user === null) return true;

    const otp_code = `${crypto.randomInt(100000, 999999)}`;

    const reset = await this.prismaService.adminPasswordReset.findFirst({
      where: {
        email
      }
    });

    if (reset) {
      await this.prismaService.adminPasswordReset.update({
        where: { id: reset.id },
        data: { reset_code: otp_code }
      });
    } else {
      await this.prismaService.adminPasswordReset.create({
        data: {
          email,
          reset_code: otp_code
        }
      })
    }

    const text = `Welcome to Trace. password reset code is: ${otp_code}`
    this.emailService.sendMailReset({
      from: 'support@espd.com',
      to: email,
      subject: 'Forgot password',
      text,
    });
    /*if (process.env.NODE_ENV !== 'development') {

    }*/

    return true;

  }

  async resetPassword(email: string, reset_code: string, new_password: string) {
    const reset = await this.prismaService.adminPasswordReset.findFirst({
      where: {
        email,
        reset_code
      }
    });
    if (reset === null) {
      return false;
    }


    if (reset) {
      const hash = bcryptjs.hashSync(new_password.toString(), 10);
      await this.prismaService.adminUser.update({
        where: {
          email
        },
        data: {
          password: hash
        }
      });
      await this.prismaService.adminPasswordReset.delete({
        where: { id: reset.id }
      });

      return true;
    }

    return false;
  }
}

