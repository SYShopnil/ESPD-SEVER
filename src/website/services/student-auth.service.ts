/* eslint-disable */

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStudentDto, LoginStudent } from '../dtos/student.dto';
import * as bcrypt from 'bcryptjs';
import { JwtSignService } from "./jwt.sign.service";

import * as crypto from 'crypto';
import {ROLE_STUDENT, ROLE_TEACHER} from "../../common/constants";
import {Role} from "../../auth/dto/role.enum";




@Injectable()
export class StudentAuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtSignService: JwtSignService,
  ) { }

  async checkIfEmailExists(email: string): Promise<boolean> {
    const check = await this.prismaService.student.findFirst({ where: { email } });
    return !!(check);
  }

  async checkIfPhoneExists(phone: string): Promise<boolean> {
    const check = await this.prismaService.student.findFirst({ where: { phone } });
    return !!(check);
  }

  async registerStudent(data: CreateStudentDto) {
    const hash = await bcrypt.hash(data.password.toString(), 10);
    data.password = hash;

    //if phone number doesnt start with +44, add it
    let phone = data.phone;
    if (!phone.startsWith('+44')) {
      phone = `+44${phone}`
    }
    const student = await this.prismaService.student.create({
      data: {
        ...data,
        phone
      }
    });
    return { is_registration: true, email: student.email, phone };
  }

  async loginStudent(data: LoginStudent) {
    const { email, password } = data
    const student = await this.prismaService.student.findFirst({ where: { email: email } })
    if (student === null) {
      throw new HttpException("Invalid Credentials", HttpStatus.UNAUTHORIZED)
    }
    if (!student.is_verified) {
      throw new HttpException("This Account Is Not Verified", HttpStatus.NOT_ACCEPTABLE)
    }
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      throw new HttpException("Invalid Credentials", HttpStatus.UNAUTHORIZED)
    }
    const access_token = this.jwtSignService.signJwt({ email: student.email, phone: student.phone, id: student.id}, Role.Student);
    delete student['password'];
    return {
      ...student,
      access_token,
      role: ROLE_STUDENT
    };
  }

  async createOtp(data) {
    const otp_code = crypto.randomInt(100000, 999999)
    data.otp = otp_code

    const is_email_exist = await this.prismaService.otpVerification.findFirst({ where: { email: data.email } })

    if (is_email_exist !== null) {
      return this.prismaService.otpVerification.update({
        where: { email: is_email_exist.email, id: is_email_exist.id },
        data
      })
    }
    return await this.prismaService.otpVerification.create({
      data
    })

  }

}
