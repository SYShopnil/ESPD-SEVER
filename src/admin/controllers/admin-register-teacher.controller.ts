import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';

import { AdminTeacherRegisterDto } from '../dtos/admin-teacher-register.dto'
import { AdminTeacherService } from '../services/admin-register-teacher-service'
import { res } from 'src/common/response.helper';

@Controller('admin/teacher/')
export class AdminTeacherContoller {
    constructor(private readonly adminTeacherService: AdminTeacherService) { }

    @Post('register')
    async registerTeacher(@Body() data: AdminTeacherRegisterDto) {

        const emailExists = await this.adminTeacherService.checkIfEmailExists(data?.email);
        if (emailExists) {
            throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
        }
        const phoneExists = await this.adminTeacherService.checkIfPhoneExists(data.phone);
        if (phoneExists) {
            throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
        }
        
        const teacher = await this.adminTeacherService.registerTeacher(data)
        return res.success(teacher, 200)
    }
}