/*eslint-disable */
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CrudService } from './crud.service';
import { CreateCrudDto } from './dto/create-crud.dto';
import { UpdateCrudDto } from './dto/update-crud.dto';
import { HasRoles } from '../auth/jwt/has-roles.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/jwt/roles.guard';
import { Role } from '../auth/dto/role.enum';

@HasRoles(Role.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('crud')
export class CrudController {
  constructor(private readonly crudService: CrudService) { }

  //TODO validate model name
  //TODO validate request body based on model
  @Post()
  create(@Body() body: any, @Query('model') model: string) {
    return this.crudService.create(body, model);
  }

  @Get()
  findAll(@Query('model') model: string) {
    return this.crudService.findAll(model);
  }

  @Post('find-where')
  findAllByWhere(@Query('model') model: string, @Body() body: any) {
    return this.crudService.findAllByWhere(model, body);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('model') model: string) {
    return this.crudService.findOne(+id, model);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCrudDto: any,
    @Query('model') model: string) {
    return this.crudService.update(+id, updateCrudDto, model);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('model') model: string) {
    return this.crudService.remove(+id, model);
  }
}
