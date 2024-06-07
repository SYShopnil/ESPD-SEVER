import { Controller, Get, Param } from '@nestjs/common';
import { BlogService } from '../services/blog.service';
import { res } from '../../common/response.helper';

@Controller('blog')
export class BlogController {

    constructor(private readonly blogService: BlogService) { }


    @Get('all')
    async getAll() {
        const response = await this.blogService.allBlog()
        return res.success(response)
    }


    @Get(':id')
    async getById(@Param('id') id: number) {
        const response = await this.blogService.getById(id)
        return res.success(response)
    }

}