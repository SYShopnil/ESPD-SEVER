import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class WeeklyHoursService {
    constructor(private readonly prismaService: PrismaService) { }

    async saveWeekHours(data, teacher_id) {
        const teacher = await this.prismaService.teacher.findFirst({ where: { id: Number(teacher_id) } });
        if (teacher === null) {
            throw new HttpException('Teacher not found', HttpStatus.NOT_FOUND)
        }
        const hours = data.hours;
        const payload = hours.map(item => {
            console.log({item});
            return {
                ...item,
                teacher_id: Number(teacher_id)
            }
        });
        await this.prismaService.teacherCalender.deleteMany({ where: { teacher_id: teacher_id } })
        return this.prismaService.teacherCalender.createMany({ data: payload })
    }

    async getWeeklyHoursTeacherById(id: number) {
        console.log({id})
        const hours = await this.prismaService.teacherCalender.findMany({ where: { teacher_id: Number(id) } })
        return hours
    }
}
