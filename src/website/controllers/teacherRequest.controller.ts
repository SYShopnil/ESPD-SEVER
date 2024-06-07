/* eslint-disable */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { TeacherRequestService } from '../services/teacherRequest.service';
import { createTeacherRequestDto } from '../dtos/teacher-request.dto'
import { res } from 'src/common/response.helper';

@Controller('teacherrequest')
export class TeacherRequestController {
    constructor(private readonly teacherRequestService: TeacherRequestService) { }

    @Post()
    async createTeacherReaquest(@Body() data: any) {
        const req = await this.teacherRequestService.createTeacherRequest(data)
        return res.success(req, 201)
    }

}
