import { Body, Controller, Get, HttpException, HttpStatus, Patch, Post, Query } from '@nestjs/common';

import { AdminTeacherRequestDto } from '../dtos/admin-teacher-request.dto'
import { AdminPasswordService } from '../services/admin-password.service'
import { res } from 'src/common/response.helper';
import { AdminPasswordChangeDto } from '../dtos/admin-password.dto';

@Controller('admin')
export class AdminPasswordController {
    constructor(private readonly adminPasswordService: AdminPasswordService) { }

    @Get('teacher/password/reset')
    teacherPasswordReset(@Query('teacher_id') teacher_id: number) {
        return this.adminPasswordService.teacherPasswordReset(teacher_id)
    }

    @Post('update/password')
    adminPasswordChange(@Body() data: AdminPasswordChangeDto) {
        return this.adminPasswordService.adminPasswordChange(data)
    }

}