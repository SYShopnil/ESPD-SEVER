/* eslint-disable */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) { }

  async getHomeData() {
    try {
      const levels = await this.prismaService.level.findMany({include: {
          SubjectOnLevel: true
        }});
      const levelCost = await this.prismaService.levelCost.findMany();
      const subjects = await this.prismaService.subject.findMany({
        include: {
          SubjectOnLevel: {
            include: {
              Level: true
            }
          }
        }
      });
      const testimonials = await this.prismaService.testimonial.findMany();
      const exam_boards = await this.prismaService.examBoard.findMany();
      const faqs = await this.prismaService.faq.findMany({
        orderBy: {
          sort_order: 'asc'
        }
      });
      const setting = await this.prismaService.setting.findMany()
      const feature = await this.prismaService.feature.findMany()
      return { data: { levels, subjects, testimonials, faqs, levelCost, exam_boards, setting, feature } };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  }
}
