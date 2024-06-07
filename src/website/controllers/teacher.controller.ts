/* eslint-disable */
import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { TeacherService } from '../services/teacher.service';
import { res } from 'src/common/response.helper';
import { WeeklyHoursService } from '../services/weekly-hours.service';
import { OptionalJwtAuthGuard } from "../../auth/jwt/optional-jwt-auth.guard";


@Controller('teacher')
export class TeacherController {
    constructor(
        private readonly teacherService: TeacherService,
        private readonly WeeklyHoursService: WeeklyHoursService
    ) { }


    @UseGuards(OptionalJwtAuthGuard)
    @Get('all')
    async getAllTeacher(@Query('page') page: number,) {
        const teachers = await this.teacherService.GetAllTeacher({ page, perPage: 10 })
        return res.success(teachers, "success")
    }

    @Get('details/:id')
    @UseGuards(OptionalJwtAuthGuard)
    async getTeacherById(@Param('id') id: number, @Req() req) {
        const user = req?.user
        const teacher = await this.teacherService.getTeacherById(Number(id), user?.id)
        return res.success(teacher, "success")
    }

    @Get()
    @UseGuards(OptionalJwtAuthGuard)
    async findAll(
        @Query('super_tutor') super_tutor: string,
        @Query('free_video_call') free_video_call: string,
        @Query('exam_board') exam_board: number,
        @Query('student_level') student_level: number,
        @Query('subject_id') subject_id: number,
        @Query('tution_type') tution_type: string,
        @Query('availability') availability: string,
        @Query('page') page: number,
        @Req() req
    ) {
        const user = req?.user;
        const teachers = await this.teacherService.findAll(
            { page, perPage: 10 },
            {
                free_video_call,
                super_tutor,
                exam_board,
                tution_type,
                availability,
                subject_id,
                student_level
            },
            user?.id
        )
        return res.success(teachers, "success")
    }

}
