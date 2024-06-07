import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BlogService {
    constructor(private readonly prismaservice: PrismaService) { }

    allBlog() {
        return this.prismaservice.blog.findMany({})
    }


    async getById(id: number) {
        const blog = await this.prismaservice.blog.findFirst({ where: { id } })
        if (blog === null) {
            throw new HttpException("Not Found", HttpStatus.NOT_FOUND)
        }
        return blog
    }
} 