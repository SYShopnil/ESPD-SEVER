import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';

import { AdminTeacherRequestDto } from '../dtos/admin-teacher-request.dto'
import { AdminTeacherRequestService } from '../services/admin-teacher-reaquest.service'
import { res } from 'src/common/response.helper';

@Controller('admin/teacher/request')
export class AdminTeacherRequestContoller {
    constructor(private readonly adminTeacherRequestService: AdminTeacherRequestService) { }

    @Post('accept')
    async AcceptRequestTeacher(@Body() data: AdminTeacherRequestDto) {
        const verify_request = await this.adminTeacherRequestService.verifyRequest(data?.token)
        const emailExists = await this.adminTeacherRequestService.checkIfEmailExists(data?.email);
        if (emailExists) {
            throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
        }
        const phoneExists = await this.adminTeacherRequestService.checkIfPhoneExists(data.phone);
        if (phoneExists) {
            throw new HttpException('Phone already exists', HttpStatus.BAD_REQUEST);
        }
        const teacher = await this.adminTeacherRequestService.registerTeacher(data)
        const response = await this.adminTeacherRequestService.AcceptRequestTeacher(verify_request.id)
        

        return res.success(response, 200)
    }
}