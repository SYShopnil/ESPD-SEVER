import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SettingService {
    constructor(private readonly prismaservice: PrismaService) { }

    getSetting() {
        return this.prismaservice.setting.findMany({})
    }
}