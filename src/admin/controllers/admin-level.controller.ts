import { Body, Controller, HttpException, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';

import { AdminLevelService } from '../services/admin-level.service'
import { res } from 'src/common/response.helper';

@Controller('admin/level')
export class AdminLevelContoller {
    constructor(private readonly adminLevelService: AdminLevelService) { }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCrudDto: any) {
        return this.adminLevelService.update(+id, updateCrudDto);
    }

}