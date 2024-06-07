/* eslint-disable */

import { Injectable } from "@nestjs/common";
import { UpdateCrudDto } from "./dto/update-crud.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CrudService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}
  //TODO add type of the body based on the model
  create(body: any, model: string) {
    return this.prismaService[model].create({
      data: body
    });
  }

  findAll(model: string) {
    return this.prismaService[model].findMany();
  }

  findOne(id: number, model: string) {
    return this.prismaService[model].findFirst({where: {id}});
  }

  update(id: number, updateCrudDto: UpdateCrudDto, model: string) {
    return this.prismaService[model].update({where: {id},
      data: updateCrudDto
    });
  }

  async remove(id: number, model: string) {
    try {
      await this.prismaService[model].delete({ where: { id } })
    } catch (e) {
      /*if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          console.log(
            'There is a unique constraint violation, a new user cannot be created with this email'
          )
        }
      }*/
      return { success: false };
      // throw e
    }
    return { success: true };
  }

  findAllByWhere(model: string, body: any) {
    let findClause: any = {};
    if (body.where) {
      findClause.where = body.where
    }
    if (body.include) {
      findClause.include = body.include
    }
    return this.prismaService[model].findMany(findClause);
  }
}
