import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TeacherDashboardService } from '../services/teacher-dashboard.service';
import { res } from 'src/common/response.helper';
import { TeacherService } from '../services/teacher.service';
import { UpdateTeacherPassword } from '../dtos/teacher.dto';
import { ROLE_TEACHER } from "../../common/constants";
import { ReviewService } from '../services/review.service';
import { WeeklyHoursService } from '../services/weekly-hours.service';
import { JwtAuthGuard } from "../../auth/jwt/jwt-auth.guard";
import { RolesGuard } from "../../auth/jwt/roles.guard";
import { HasRoles } from "../../auth/jwt/has-roles.decorator";
import { Role } from "../../auth/dto/role.enum";

@HasRoles(Role.Teacher)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('teacher')
export class TeacherDashboardController {
    constructor(
        private readonly teacherDashboardService: TeacherDashboardService,
        private readonly teacherService: TeacherService,
        private readonly reviewService: ReviewService,
        private readonly WeeklyHoursService: WeeklyHoursService
    ) { }

    @Get('dashboard/booking-list')
    async getBooking(@Query('type') type: string, @Req() req) {
        const user = req.user
        const teacher_id = user?.id
        const booking = await this.teacherDashboardService.getBookingList(Number(teacher_id), type)
        return res.success(booking, "success")
    }

    @Get('profile')
    async getTeacherById(@Req() req) {
        const user = req.user
        console.log('prooo', user);
        const teacher = await this.teacherService.getTeacherById(user?.id)
        return res.success(teacher, "success")
    }

    @Post('update/info')
    async updateTeacherInfo(@Req() req, @Body() data) {
        const user = req.user
        const id = Number(user?.id)
        const response = await this.teacherService.updateTeacherInfo(data, id);
        return res.success({ ...response, role: ROLE_TEACHER }, "update success")
    }


    @Post('update/password')
    async updateStudentPassword(@Req() req, @Body() data: UpdateTeacherPassword) {
        const user = req.user
        const id = Number(user?.id)
        const update_teacher = await this.teacherService.updateTeacherPassword(id, data)
        return res.success(update_teacher, "update successfull")
    }



    @Post('weeklyhours')
    async saveWeeklyHours(@Body() data, @Req() req) {
        const user = req.user
        const id = Number(user?.id)
        const response = await this.WeeklyHoursService.saveWeekHours(data, Number(id))
        return res.success(response, "success")
    }


    @Get('weeklyhours')
    async getWeeklyHoursById(@Req() req) {
        const user = req.user
        const id = Number(user?.id)
        const weekHours = await this.WeeklyHoursService.getWeeklyHoursTeacherById(Number(id))
        return res.success(weekHours, "success")
    }


}
