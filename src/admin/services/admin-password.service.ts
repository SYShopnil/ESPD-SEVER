import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { AdminPasswordChangeDto } from '../dtos/admin-password.dto';




@Injectable()
export class AdminPasswordService {
    constructor(private readonly prismaService: PrismaService) { }

    async teacherPasswordReset(teacher_id: number) {
        const valid_teacher = await this.prismaService.teacher.findFirst({ where: { id: teacher_id } })
        if (valid_teacher === null) {
            throw new HttpException("User Not Allowd", HttpStatus.NOT_ACCEPTABLE)
        }
        const temp_pass = process.env.TEMPORARY_PASSWORD
        const hash = await bcrypt.hash(temp_pass.toString(), 10)
        const update_teacher = await this.prismaService.teacher.update({
            where: { id: teacher_id, email: valid_teacher?.email },
            data: {
                password: hash
            }
        })
        delete update_teacher["password"]
        return update_teacher;
    }


    async adminPasswordChange(payload: AdminPasswordChangeDto) {
        const valid_admin = await this.prismaService.adminUser.findFirst({ where: { email: payload?.email } })
        if (valid_admin === null) {
            throw new HttpException("User Not Allowd", HttpStatus.NOT_ACCEPTABLE)
        }

        const hash = await bcrypt.hash(payload.new_password.toString(), 10)
        const update_admin = await this.prismaService.adminUser.update({
            where: { email: payload?.email },
            data: {
                password: hash
            }
        })
        delete update_admin["password"]
        return update_admin;
    }
}
