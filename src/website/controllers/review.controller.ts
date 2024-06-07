import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { res } from 'src/common/response.helper';

import { ReviewDto } from '../dtos/review.dto';
import { ReviewService } from '../services/review.service';

@Controller('teacher/review')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) { }

    @Post('submit')
    async submitReview(@Body() data: ReviewDto) {
        const review = await this.reviewService.submitReview(data)
        return res.success(review, "Success")
    }

    @Get(':id')
    async getReviewByTeacherId(@Param('id') teacher_id: number) {
        return this.reviewService.getReviewByTeacherId(teacher_id)
    }
}
