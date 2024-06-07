import { Body, Controller, Post } from '@nestjs/common';
import { res } from 'src/common/response.helper';

import { TutorFindDto } from "../dtos/tutor-find-dto";
import { FindTutorService } from "../services/find-tutor.service"

@Controller('findtutor')
export class FindTutorController {
    
    constructor ( private readonly findTutorService: FindTutorService){ }

    @Post('create')
    async CreatingFindTutor(@Body() data: TutorFindDto) {
        const request = await this.findTutorService.CreateFindTutor(data)
        return  res.success(request);
    }
}