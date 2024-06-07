import { Injectable } from '@nestjs/common';
import { CreateGscDto } from './dto/create-gsc.dto';
import { UpdateGscDto } from './dto/update-gsc.dto';

@Injectable()
export class GscService {
  create(createGscDto: CreateGscDto) {
    return 'This action adds a new gsc';
  }

  findAll() {
    return `This action returns all gsc`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gsc`;
  }

  update(id: number, updateGscDto: UpdateGscDto) {
    return `This action updates a #${id} gsc`;
  }

  remove(id: number) {
    return `This action removes a #${id} gsc`;
  }
}
