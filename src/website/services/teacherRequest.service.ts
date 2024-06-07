/* eslint-disable */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { createTeacherRequestDto } from '../dtos/teacher-request.dto'
import { res } from 'src/common/response.helper';
import { v4 as uuidv4 } from 'uuid';



@Injectable()
export class TeacherRequestService {
    constructor(private readonly prismaService: PrismaService) { }

    async createTeacherRequest(data: createTeacherRequestDto) {

        const isRequestExist = await this.prismaService.teacherOnboardRequest.findFirst({ where: { email: data.email } })

        if (isRequestExist !== null) {
            throw new HttpException('Request Already Exist', HttpStatus.CONFLICT)
        }

        data.token = uuidv4();
        const reponse = await this.prismaService.teacherOnboardRequest.create({ data });

        return reponse;
    }

    
}
