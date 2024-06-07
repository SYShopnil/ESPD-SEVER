/* eslint-disable */
import { Body, Controller, HttpException, HttpStatus, Post,Get,Param, Query } from '@nestjs/common';
import { TeacherAuthService } from '../services/teacher-auth.service';
import { RegisterTeacherDto, LoginTeacher } from '../dtos/teacher.dto';
import { res } from 'src/common/response.helper';


@Controller('auth/teacher')
export class TeacherAuthController {
    constructor(private readonly teacherAuthService: TeacherAuthService) { }

    @Post('register')
    async registerTeacher(@Body() data: RegisterTeacherDto) {
        const emailExists = await this.teacherAuthService.checkIfEmailExists(data.email);
        if (emailExists) {
            throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
        }
        const phoneExists = await this.teacherAuthService.checkIfPhoneExists(data.phone);
        if (phoneExists) {
            throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
        }
        const request = await this.teacherAuthService.registerTeacher(data)
        return res.success(request, 201)
    }

    @Post('login')
    async loginTeacher(@Body() data: LoginTeacher) {
        const request = await this.teacherAuthService.LoginTeacher(data)
        return res.success(request, "Success")
    }

    @Get('all')
    async getAllTeacher(){
        return this.teacherAuthService.GetAllTeacher()
    }

    @Get(':id')
    async getTeacherById(@Param('id') id : number){
        return this.teacherAuthService.getTeacherById(id)
    }


    @Get('request/verify')
    async verifyOtp(@Query('token') token : string){
        console.log(token)
        const is_accepted = await this.teacherAuthService.verifyOtp(token)
        return res.success(is_accepted, "verified")
    }
}
