import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';




@Injectable()
export class AdminTeacherService {
    constructor(private readonly prismaService: PrismaService) { }

    async registerTeacher(data) {
        delete data["token"]
        const hash = await bcrypt.hash(data?.password.toString(), 10);
        data.password = hash;
        const teacher = await this.prismaService.teacher.create({ data });
        if (teacher === null) {
            throw new HttpException('Teacher No Create', HttpStatus.BAD_REQUEST);
        }
        return {
            is_created: true,
            email: teacher.email,
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
