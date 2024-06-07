import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { ReviewDto } from '../dtos/review.dto'

@Injectable()
export class ReviewService {
    constructor(private readonly prismaService: PrismaService) { }

    async submitReview(data: ReviewDto) {
        return this.prismaService.review.create({ data })
    }

    async getReviewByTeacherId(teacher_id: number) {
        return this.prismaService.review.findMany({ where: { teacher_id: teacher_id , } , include: {student:{select:{first_name:true , last_name:true}}} } )
    }
}