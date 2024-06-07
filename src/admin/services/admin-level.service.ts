import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../../prisma/prisma.service';
import { UpdateCrudDto } from 'src/crud/dto/update-crud.dto';



@Injectable()
export class AdminLevelService {
  constructor(private readonly prismaService: PrismaService, private readonly configService: ConfigService) { }

  async update(id: number, updateCrudDto: UpdateCrudDto) {
    await this.prismaService.subjectOnLevel.deleteMany({ where: { level_id: id } })
    return this.prismaService.level.update({
      where: { id },
      data: updateCrudDto
    });
  }



}
