/* eslint-disable */
import { Body, Controller, HttpException, HttpStatus, Post, } from '@nestjs/common';
import { StudentAuthService } from '../services/student-auth.service';
import { CreateStudentDto, LoginStudent } from '../dtos/student.dto';
import { res } from 'src/common/response.helper';
import EmailService from '../../email/email.service';
import SmsService from "../../email/sms.service";
import { PrismaService } from '../../prisma/prisma.service';

@Controller('auth/student')
export class StudentAuthController {
  constructor(
    private readonly studentAuthService: StudentAuthService,
    private readonly EmailService: EmailService,
    private readonly smsService: SmsService,
    private readonly prismaService: PrismaService
  ) { }

  @Post('register')
  async createStudent(@Body() data: CreateStudentDto) {
    const emailExists = await this.studentAuthService.checkIfEmailExists(data.email);
    if (emailExists) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }
    const phoneExists = await this.studentAuthService.checkIfPhoneExists(data.phone);
    if (phoneExists) {
      throw new HttpException('Phone already exists', HttpStatus.BAD_REQUEST);
    }
    const request = await this.studentAuthService.registerStudent(data)
    const otp_req = await this.studentAuthService.createOtp({ email: request.email })
    const brand_url = await this.prismaService.setting.findFirst({ where: { key: "logo" } })
    const text = `Let’s get you registered. Your OTP is ${otp_req.otp}.`
    const html = `<div>
    <p>Let’s get you registered.</p>
    <p>Your OTP is ${otp_req.otp}</p>
    <div>
      <img src="${brand_url?.value}" alt="ESPD" style="max-width:250px;">
    </div>
    </div>`

    const send_email = await this.EmailService.sendEmail(request.email, 'Welcome to ESPD!', "", html);
    await this.smsService.sendSMS(request.phone, text);

    return res.success({ ...request, send_otp: true }, 201)
  }

  @Post('login')
  async loginStudent(@Body() data: LoginStudent) {
    const request = await this.studentAuthService.loginStudent(data)
    return res.success(request, "Success")
  }

}
