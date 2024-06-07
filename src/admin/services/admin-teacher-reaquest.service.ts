import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';

import { PrismaService } from '../../prisma/prisma.service';
import { AdminTeacherRequestDto } from '../dtos/admin-teacher-request.dto'
import * as bcrypt from 'bcryptjs';




@Injectable()
export class AdminTeacherRequestService {
    private nodemailerTransport: Mail;
    constructor(private readonly prismaService: PrismaService, private readonly configService: ConfigService) {
        this.nodemailerTransport = createTransport({
            service: 'Gmail',
            // host: 'smtp.sendgrid.net',
            port: 587,
            /* auth: {
              user: configService.get<string>('gmail_user'),
              pass: configService.get<string>('gmail_app_password'),
            },*/
            auth: {
                user: 'talrocktest@gmail.com',
                pass: 'rdxfqgahngmqpcep',
            },
            //   logger: true,
            //   debug: true,
        });
    }



    async AcceptRequestTeacher(id) {
        const update_request = await this.prismaService.teacherOnboardRequest.delete({
            where: { id }
        })
        return { teacher_created: true, accepted: true }
    }


    async verifyRequest(token) {
        const teacher_request = await this.prismaService.teacherOnboardRequest.findFirst({ where: { token: token } })
        if (teacher_request === null) {
            throw new HttpException('Request Is Not Valid', HttpStatus.BAD_REQUEST);
        }
        return teacher_request
    }




    sendMail(url: string, email: string): void {
        this.nodemailerTransport.sendMail({
            to: email,
            from: 'talrocktest@gmail.com',
            subject: 'Welcome to ESPD',
            text: `Welcome to EsPd. Is Your Verification Code Is ${url}`,
            html: `Your request has been accepted. Please visit this link to create your profile on ESPD. <br> <a href="${url}">${url}</a>`,
        })
    }

    createLink(token: string): string {
        return `${process.env.WEBSITE_BASE_URL}/teacher-signup?token=${token}`
    }


    async registerTeacher(data) {
        delete data["token"]
        const temp_password = process.env.TEMPORARY_PASSWORD
        const hash = await bcrypt.hash(temp_password.toString(), 10);
        data.password = hash;
        const teacher = await this.prismaService.teacher.create({ data });
        if (teacher === null) {
            throw new HttpException('Teacher No Create', HttpStatus.BAD_REQUEST);
        }
        return {
            is_created: true,
            email: teacher.email,
            work_email: teacher.work_email,
            first_name: teacher.first_name,
            last_name: teacher.last_name
        }
    }


    async checkIfEmailExists(email: string): Promise<boolean> {
        const check = await this.prismaService.teacher.findFirst({ where: { email } });
        return !!(check);
    }

    async checkIfPhoneExists(phone: string): Promise<boolean> {
        const check = await this.prismaService.teacher.findFirst({ where: { phone } });
        return !!(check);
    }
}
