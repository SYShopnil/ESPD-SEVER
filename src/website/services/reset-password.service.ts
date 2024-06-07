/* eslint-disable */

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterTeacherDto, LoginTeacher } from '../dtos/teacher.dto';
import * as bcrypt from 'bcryptjs';
import { JwtSignService } from "./jwt.sign.service";
import { ROLE_STUDENT, ROLE_TEACHER } from "../../common/constants";
import { RequestOtpDto, ResetPasswordDto, ResetPasswordVerifyOtpDto } from "../dtos/request-otp.dto";
import EmailService from "../../email/email.service";
import crypto from "crypto";
import { v4 as uuidv4 } from 'uuid';
import { Role } from "../../auth/dto/role.enum";


@Injectable()
export class ResetPasswordService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtSignService: JwtSignService,
        private readonly emailService: EmailService,
    ) { }


    async requestOtp(data: RequestOtpDto) {
        let user = null;
        let role = null;
        //first search in student table
        user = await this.prismaService.student.findFirst({
            where: {
                email: data.email
            }
        });
        role = ROLE_STUDENT;

        //if not found look into teacher table
        if (user === null) {
            user = await this.prismaService.teacher.findFirst({
                where: {
                    email: data.email
                }
            });
            role = ROLE_TEACHER;
        }

        ///if still not found then user not exist
        if (user === null) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        let request_data: any = {
            email: data.email,
            role
        }
        const otp = crypto.randomInt(100000, 999999)
        request_data.token = uuidv4();
        request_data.otp = String(otp);

        const check = await this.prismaService.resetPassword.findFirst({
            where: {
                email: data.email
            }
        });
        if (check) {
            await this.prismaService.resetPassword.update({
                where: { email: data.email },
                data: { otp: String(otp) }
            });
        } else {
            const request = await this.prismaService.resetPassword.create({
                data: request_data
            });
        }

        const text = `Your  password reset code is: ${otp}`
        try {
            await this.emailService.sendEmail(data.email, 'ESPD - Reset password', text);
        } catch (err){
            throw new HttpException('Failed to send otp', 404);
        }

        return true;
    }

    async verifyOtp(data: ResetPasswordVerifyOtpDto) {

        const check = await this.prismaService.resetPassword.findFirst({
            where: {
                email: data.email,
                otp: data.otp
            }
        });

        if (check === null) {
            throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST)
        }
        await this.prismaService.resetPassword.update({
            where: { id: check.id },
            data: {
                is_verified: true
            }
        })

        return {
            verified: true,
            token: check.token
        }
    }

    async resetPassword(data: ResetPasswordDto) {

        const check = await this.prismaService.resetPassword.findFirst({
            where: {
                token: data.token,
            }
        });

        if (check === null) {
            throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST)
        }
        if (!check.is_verified) {
            throw new HttpException('OTP not verified', HttpStatus.BAD_REQUEST)
        }

        //update password
        const role = check.role;
        const hash = await bcrypt.hash(data.password.toString(), 10);
        let user;
        if (check.role === ROLE_STUDENT) {
            await this.prismaService.student.update({
                where: {
                    email: check.email
                },
                data: {
                    password: hash
                }
            });
            user = await this.prismaService.student.findFirst({
                where: {
                    email: check.email
                }
            });
        } else {
            await this.prismaService.teacher.update({
                where: {
                    email: check.email
                },
                data: {
                    password: hash
                }
            });
            user = await this.prismaService.teacher.findFirst({
                where: {
                    email: check.email
                }
            });
        }

        const jwt_role = role === ROLE_STUDENT ? Role.Student : Role.Teacher;
        const access_token = this.jwtSignService.signJwt({ email: user.email, phone: user.phone, id: user.id }, jwt_role);
        delete user['password'];

        await this.prismaService.resetPassword.delete({
            where: { id: check.id }
        });

        return {
            ...user,
            access_token,
            role: role
        };
    }
}
