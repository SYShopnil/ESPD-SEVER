import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtSignService } from './jwt.sign.service';
import { ROLE_STUDENT } from "../../common/constants";



@Injectable()
export class SocialAuthService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly JwtSignService: JwtSignService
  ) { }


  async checkIfEmailExists(email: string): Promise<boolean> {
    const check = await this.prismaService.student.findFirst({ where: { email } });
    return !!(check);
  }



  loginValidation(req) {
    if (!req.user) {
      throw new HttpException("not found", HttpStatus.NOT_ACCEPTABLE)
    }

    return {
      message: 'User information from Social',
      user: req.user
    }
  }

  async saveTokens(req) {
    if (!req.user) {
      throw new HttpException("not found", HttpStatus.NOT_ACCEPTABLE)
    }

    const profile = req.user?.profile;
    const email = profile?.emails[0]?.value;

    const teacher = await this.prismaService.teacher.findFirst({
      where: {
        email
      }
    });
    if (teacher === null) {
      throw new HttpException("Teacher profile not found", HttpStatus.NOT_FOUND)
    }

    await this.prismaService.teacher.update({
      where: {
        id: teacher?.id
      },
      data: {
        google_access_token: req?.user?.accessToken,
        google_refresh_token: req?.user?.refreshToken
      }
    });

    return {
      message: 'User information from Social',
      user: req.user
    }
  }



  async googleUser(profile: any, login_type) {
    const { name, emails, photos, provider } = profile
    const data = {
      email: String(emails[0]?.value),
      first_name: String(name.givenName),
      last_name: String(name.familyName),
      profile_photo: String(photos[0]?.value),
      login_type: login_type
    }

    const existEmail = await this.checkIfEmailExists(data.email)
    if (existEmail) {
      const student = await this.prismaService.student.findFirst({ where: { email: data?.email } })
      const access_token = this.JwtSignService.signJwt({ email: student.email, phone: student?.phone, id: student.id });
      delete student['password'];
      return {
        ...student,
        access_token,
        role: ROLE_STUDENT
      };
    } else {
      const student = await this.prismaService.student.create({ data })
      const access_token = this.JwtSignService.signJwt({ email: student.email, phone: student?.phone, id: student.id });
      delete student['password'];
      return {
        ...student,
        access_token,
        role: ROLE_STUDENT
      };
    }
  }



  async facebookUser(profile: any, login_type) {
    const { email, phone, firstName, lastName } = profile.user
    const data = {
      email: String(email),
      phone: String(phone),
      first_name: String(firstName),
      last_name: String(lastName),
      login_type: login_type
    }
    const existEmail = await this.checkIfEmailExists(data.email)
    if (existEmail) {
      const student = await this.prismaService.student.findFirst({
        where: {
          OR: [
            { email: data?.email },
            { phone: data?.phone }
          ]
        }
      })
      const access_token = this.JwtSignService.signJwt({ email: student.email, phone: student?.phone, id: student.id });
      delete student['password'];
      return {
        ...student,
        access_token,
        role: ROLE_STUDENT
      };
    } else {
      const student = await this.prismaService.student.create({ data })
      const access_token = this.JwtSignService.signJwt({ email: student.email, phone: student?.phone, id: student.id });
      delete student['password'];
      return {
        ...student,
        access_token,
        role: ROLE_STUDENT
      };
    }
  }


  async valideTionUser(accessToken) {
    const verifyJwt = await this.JwtSignService.verifyAsync(accessToken)
    const student = await this.prismaService.student.findFirst({ where: { id: verifyJwt?.id } })
    if (student === null) {
      throw new HttpException("validtion failed", HttpStatus.NOT_ACCEPTABLE)
    }
    delete student["password"]
    return {
      ...student,
      access_token: accessToken,
      role: ROLE_STUDENT
    };
  }

}
