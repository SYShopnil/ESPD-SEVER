import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MessageDto } from '../dtos/message.dto';


@Injectable()
export class TeacherContactMessageService {

    constructor(private readonly prismaService: PrismaService) { }

    async contactWithTeacher(data: MessageDto) {
        const message = await this.prismaService.message.create({
            data,
            include: {
                Teacher: {
                    select: {
                        email: true
                    }
                },
                ExamBoard: true

            }
        })

        return { ...message, is_created: true, send_message: false }
    }

}