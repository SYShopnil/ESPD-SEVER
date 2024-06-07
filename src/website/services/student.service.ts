import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as bcrypt from 'bcryptjs';

import { PrismaService } from "../../prisma/prisma.service";
import { UpdateStudentInfo, UpdateStudentPassword } from "../dtos/student.dto";
import { MessageDto } from "../dtos/message.dto";


@Injectable()
export class StudentService {
    constructor(private readonly PrismaService: PrismaService) { }

    async getStudentById(id: number) {
        const student = await this.PrismaService.student.findFirst({ where: { id: id } })
        return student;
    }


    async updateStudentInfo(data, id: number) {

        const student = await this.PrismaService.student.findFirst({ where: { id: id } })
        if (student == null) {
            throw new HttpException("you are not eligable", HttpStatus.BAD_REQUEST)
        }
        const update_student = await this.PrismaService.student.update({
            where: { id: id },
            data
        })
        delete update_student["password"]
        return update_student
    }

    async updateStudentPassword(id: number, payload: UpdateStudentPassword) {
        const student = await this.PrismaService.student.findFirst({ where: { id: id } })
        if (student == null) {
            throw new HttpException("you are not here", HttpStatus.BAD_REQUEST)
        }
        const hash = await bcrypt.hash(payload.new_password.toString(), 10)
        const update_student = await this.PrismaService.student.update({
            where: { id: id },
            data: {
                password: hash
            }
        })
        delete update_student["password"]
        return update_student;
    }

}