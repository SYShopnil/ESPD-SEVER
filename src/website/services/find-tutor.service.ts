import { Injectable } from "@nestjs/common";

import { PrismaService } from '../../prisma/prisma.service';
import { TutorFindDto } from "../dtos/tutor-find-dto";


@Injectable()
export class FindTutorService {
    constructor(private readonly PrismaService: PrismaService) { }

    async CreateFindTutor(data: TutorFindDto) {
        return this.PrismaService.findTutor.create({ data })
    }

}