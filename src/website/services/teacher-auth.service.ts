/* eslint-disable */

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterTeacherDto, LoginTeacher } from '../dtos/teacher.dto';
import * as bcrypt from 'bcryptjs';
import { JwtSignService } from "./jwt.sign.service";
import { ROLE_TEACHER } from "../../common/constants";
import {Role} from "../../auth/dto/role.enum";


@Injectable()
export class TeacherAuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtSignService: JwtSignService
    ) { }

    async checkIfEmailExists(email: string): Promise<boolean> {
        const check = await this.prismaService.teacher.findFirst({ where: { email } });
        return !!(check);
    }

    async checkIfPhoneExists(phone: string): Promise<boolean> {
        const check = await this.prismaService.teacher.findFirst({ where: { phone } });
        return !!(check);
    }

    async registerTeacher(data: RegisterTeacherDto) {
        const hash = await bcrypt.hash(data.password.toString(), 10);
        data.password = hash;

        const teacher = await this.prismaService.teacher.create({ data });
        const response: any = {};
        response.teacher = teacher;
        const access_token = this.jwtSignService.signJwt(teacher);
        delete teacher['password'];
        return {
            ...teacher,
            access_token,
            role: ROLE_TEACHER
        };

    }

    async LoginTeacher(data: LoginTeacher) {
        const { email, password } = data
        const teacher = await this.prismaService.teacher.findFirst({ where: { email: email.trim() } });
        if (teacher === null) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED)
        }
        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED)
        }
        const access_token = this.jwtSignService.signJwt({ email: teacher.email, phone: teacher.phone, id: teacher.id }, Role.Teacher);

        delete teacher['password']
        return {
            ...teacher,
            access_token,
            role: ROLE_TEACHER
        };
    }

    async GetAllTeacher() {
        const data = await this.prismaService.teacher.findMany()
        return data
    }

    async getTeacherById(id: number) {
        const teacher = await this.prismaService.teacher.findFirst({ where: { id: id } })
        return teacher;
    }

    async verifyOtp(token: string) {
        const response = await this.prismaService.teacherOnboardRequest.findFirst({ where: { token: token } })

        if (response === null) {
            throw new HttpException("InValid Token", HttpStatus.BAD_REQUEST)
        }
        if (!response.is_accepted) {
            throw new HttpException("InValid Token", HttpStatus.BAD_REQUEST)
        }

        return { is_accepted: response.is_accepted, work_email: response.work_email, }
    }
}
